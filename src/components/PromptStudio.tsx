"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ROLE_CONFIG, WorkflowStepStatus } from "@/lib/types";
import { WorkflowEngineRecord, WorkflowEngineStep, WorkflowStepExecutionStatus } from "@/lib/workflowEngine";
import { ApiResponse } from "@/lib/apiContracts";
import { CheckCircle2, Circle, Loader2, XCircle, ChevronRight, Zap, Play, Pause, RotateCcw, AlertTriangle, CornerDownRight } from "lucide-react";

const stepIcon: Record<WorkflowStepExecutionStatus, React.ElementType> = {
  completed: CheckCircle2,
  running: Loader2,
  pending: Circle,
  failed: XCircle,
  paused: Pause,
};

const stepColors: Record<WorkflowStepExecutionStatus, { border: string; bg: string; text: string }> = {
  completed: { border: "#10D9B1", bg: "rgba(16,217,177,0.07)", text: "#10D9B1" },
  running:   { border: "var(--accent-2, #5B8DEF)", bg: "rgba(91,141,239,0.07)", text: "var(--accent-2, #5B8DEF)" },
  pending:   { border: "var(--border-dim)", bg: "transparent", text: "var(--text-muted)" },
  failed:    { border: "#FF4D6A", bg: "rgba(255,77,106,0.07)", text: "#FF4D6A" },
  paused:    { border: "#f59e0b", bg: "rgba(245,158,11,0.07)", text: "#f59e0b" },
};

function WorkflowStepNode({
  step,
  isLast,
  onRetry,
}: {
  step: WorkflowEngineStep;
  isLast: boolean;
  onRetry?: () => void;
}) {
  const Icon = stepIcon[step.status] || Circle;
  const colors = stepColors[step.status] || stepColors.pending;
  const agentName = ROLE_CONFIG[step.agentId]?.name ?? step.agentId;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div
          className="flex-1 min-w-0 flex items-center justify-between gap-2 px-3 py-2 border text-left transition-colors"
          style={{ borderColor: colors.border, background: colors.bg }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icon size={13} className={cn(step.status === "running" && "animate-spin")} style={{ color: colors.text, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-semibold font-mono truncate" style={{ color: step.status === "pending" ? "var(--text-muted)" : "var(--text)" }}>
                  {step.label}
                </p>
                <span className="mono-label text-[9px] px-1 py-0.2 border" style={{ borderColor: "var(--border-dim)", color: "var(--text-muted)" }}>
                  {agentName}
                </span>
              </div>
              {step.dependencies.length > 0 && (
                <span className="mono-label text-[8px] text-gray-500 block truncate">
                  DEPS: [{step.dependencies.join(", ")}]
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {step.duration && <span className="mono-label text-[10px]">{step.duration}</span>}
            {step.status === "failed" && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 px-2 py-0.5 border text-[9px] mono-label bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
                title="Retry this step"
              >
                <RotateCcw size={10} />
                <span>RETRY</span>
              </button>
            )}
          </div>
        </div>
        {!isLast && <ChevronRight size={12} style={{ color: step.status === "completed" ? "#10D9B1" : "var(--border-dim)", flexShrink: 0 }} />}
      </div>

      {/* Output / Error drawer */}
      {step.output && (
        <div className="ml-5 p-2 border text-[10px] font-mono leading-relaxed bg-black/30 border-emerald-500/20 text-emerald-300 flex items-start gap-1">
          <CornerDownRight size={10} className="flex-shrink-0 mt-0.5 text-emerald-400" />
          <span className="truncate">{step.output}</span>
        </div>
      )}
      {step.error && (
        <div className="ml-5 p-2 border text-[10px] font-mono leading-relaxed bg-rose-500/10 border-rose-500/30 text-rose-400 flex items-start gap-1">
          <AlertTriangle size={10} className="flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{step.error}</span>
        </div>
      )}
    </div>
  );
}

export default function WorkflowView() {
  const [workflows, setWorkflows] = useState<WorkflowEngineRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch("/api/workflows", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as ApiResponse<WorkflowEngineRecord[]>;
        if (json.success && json.data) {
          setWorkflows(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch workflows:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerWorkflowAction = async (workflowId: string, action: "play" | "pause" | "retry", stepId?: string) => {
    try {
      const res = await fetch("/api/workflows/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId, action, stepId }),
      });

      if (res.ok) {
        const json = (await res.json()) as ApiResponse<WorkflowEngineRecord>;
        if (json.success && json.data) {
          setWorkflows((prev) => prev.map((w) => (w.id === json.data!.id ? json.data! : w)));
        }
      }
    } catch (err) {
      console.error(`Failed to trigger workflow action '${action}':`, err);
    }
  };

  return (
    <div className="guild-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--border-dim)" }}>
        <Zap size={13} style={{ color: "var(--accent)" }} />
        <span className="mono-label" style={{ color: "var(--text)", fontSize: 11 }}>DAG WORKFLOW RUNNER</span>
        <span className="mono-label text-[9px] px-1.5 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
          ENGINE: ONLINE
        </span>
        <span className="mono-label ml-auto">{workflows.length} PIPELINES</span>
      </div>

      {/* Workflows */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {loading && workflows.length === 0 && (
          <div className="py-12 text-center text-xs font-mono text-gray-500">Loading DAG workflows...</div>
        )}

        {workflows.map((wf) => (
          <motion.div key={wf.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 p-3 border" style={{ borderColor: "var(--border-dim)", background: "var(--surface)" }}>
            {/* Workflow Header Controls */}
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--border-dim)" }}>
              <div>
                <span className="font-bold text-xs mono-label" style={{ color: "var(--text)" }}>{wf.name}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="mono-label text-[9px]" style={{
                    color: wf.status === "running" ? "#5B8DEF" : wf.status === "completed" ? "#10D9B1" : wf.status === "failed" ? "#FF4D6A" : wf.status === "paused" ? "#f59e0b" : "var(--text-muted)"
                  }}>
                    STATUS: {wf.status.toUpperCase()}
                  </span>
                  <span className="mono-label text-[9px] text-gray-500">| PROGRESS: {wf.progressPercent}%</span>
                </div>
              </div>

              {/* Real Play / Pause / Retry Action Buttons */}
              <div className="flex items-center gap-1.5">
                {wf.status === "running" ? (
                  <button
                    type="button"
                    onClick={() => triggerWorkflowAction(wf.id, "pause")}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono border font-bold bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                    title="Pause execution"
                  >
                    <Pause size={11} />
                    <span>PAUSE</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerWorkflowAction(wf.id, "play")}
                    disabled={wf.status === "completed"}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono border font-bold bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40"
                    title="Play / Resume execution"
                  >
                    <Play size={11} />
                    <span>PLAY</span>
                  </button>
                )}

                {wf.status === "failed" && (
                  <button
                    type="button"
                    onClick={() => triggerWorkflowAction(wf.id, "retry")}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono border font-bold bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                    title="Retry failed workflow step"
                  >
                    <RotateCcw size={11} />
                    <span>RETRY</span>
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full" style={{ background: "var(--border-dim)" }}>
              <motion.div
                className="h-full"
                style={{ background: wf.status === "failed" ? "#FF4D6A" : `linear-gradient(90deg, var(--accent), var(--accent-2, #5B8DEF))` }}
                animate={{ width: `${wf.progressPercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Steps list */}
            <div className="space-y-2 pt-1">
              {wf.steps.map((step, i) => (
                <WorkflowStepNode
                  key={step.id}
                  step={step}
                  isLast={i === wf.steps.length - 1}
                  onRetry={() => triggerWorkflowAction(wf.id, "retry", step.id)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

