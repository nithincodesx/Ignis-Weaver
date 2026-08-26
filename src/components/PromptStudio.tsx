"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Workflow, WorkflowStep, WorkflowStepStatus, ROLE_CONFIG } from "@/lib/types";
import { CheckCircle2, Circle, Loader2, XCircle, ChevronRight, Zap } from "lucide-react";

const stepIcon: Record<WorkflowStepStatus, React.ElementType> = {
  completed: CheckCircle2,
  active: Loader2,
  pending: Circle,
  failed: XCircle,
};

const stepColors: Record<WorkflowStepStatus, { border: string; bg: string; text: string }> = {
  completed: { border: "#10D9B1", bg: "rgba(16,217,177,0.07)", text: "#10D9B1" },
  active:    { border: "var(--accent-2, #5B8DEF)", bg: "rgba(91,141,239,0.07)", text: "var(--accent-2, #5B8DEF)" },
  pending:   { border: "var(--border-dim)", bg: "transparent", text: "var(--text-muted)" },
  failed:    { border: "#FF4D6A", bg: "rgba(255,77,106,0.07)", text: "#FF4D6A" },
};

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id:"wf1", name:"MARKET INTELLIGENCE SCAN", progress:75,
    steps:[
      { id:"s1", label:"Data Ingestion",   agent:"researcher",   status:"completed", duration:"4.2s" },
      { id:"s2", label:"Pattern Analysis", agent:"analyst",      status:"completed", duration:"8.1s" },
      { id:"s3", label:"Report Gen",       agent:"researcher",   status:"active",    duration:"—"    },
      { id:"s4", label:"Visual Summary",   agent:"designer",     status:"pending" },
      { id:"s5", label:"QA Check",         agent:"qa-engineer",  status:"pending" },
    ],
  },
  {
    id:"wf2", name:"FEATURE DEPLOYMENT PIPELINE", progress:40,
    steps:[
      { id:"s6", label:"Code Generation",  agent:"developer",   status:"completed", duration:"12.4s" },
      { id:"s7", label:"Test Suite",       agent:"qa-engineer", status:"active",    duration:"—"     },
      { id:"s8", label:"Security Audit",   agent:"qa-engineer", status:"pending" },
      { id:"s9", label:"Deploy Staging",   agent:"developer",   status:"pending" },
    ],
  },
];

function WorkflowStepNode({ step, isLast, onStepClick }: { step: WorkflowStep; isLast: boolean; onStepClick?: () => void }) {
  const Icon = stepIcon[step.status];
  const colors = stepColors[step.status];
  const agentName = ROLE_CONFIG[step.agent]?.subtitle ?? step.agent;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onStepClick}
        type="button"
        className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 border text-left transition-colors hover:border-emerald-500/50"
        style={{ borderColor: colors.border, background: colors.bg }}
      >
        <Icon size={13} className={cn(step.status === "active" && "animate-spin")} style={{ color: colors.text, flexShrink:0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold font-mono truncate" style={{ color: step.status === "pending" ? "var(--text-muted)" : "var(--text)" }}>{step.label}</p>
          <p className="mono-label truncate">{agentName}</p>
        </div>
        {step.duration && <span className="mono-label flex-shrink-0">{step.duration}</span>}
      </button>
      {!isLast && <ChevronRight size={12} style={{ color: step.status === "completed" ? "#10D9B1" : "var(--border-dim)", flexShrink:0 }} />}
    </div>
  );
}

export default function WorkflowView() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);

  const toggleStepStatus = (wfId: string, stepId: string) => {
    setWorkflows(prev => prev.map(wf => {
      if (wf.id !== wfId) return wf;
      const updatedSteps = wf.steps.map(s => {
        if (s.id !== stepId) return s;
        const nextStatus: WorkflowStepStatus =
          s.status === "pending" ? "active" :
          s.status === "active" ? "completed" :
          s.status === "completed" ? "failed" : "pending";
        return { ...s, status: nextStatus, duration: nextStatus === "completed" ? "manual" : s.duration };
      });
      const doneCount = updatedSteps.filter(s => s.status === "completed").length;
      return {
        ...wf,
        steps: updatedSteps,
        progress: Math.round((doneCount / updatedSteps.length) * 100),
      };
    }));
  };

  return (
    <div className="guild-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor:"var(--border-dim)" }}>
        <Zap size={13} style={{ color:"var(--accent)" }} />
        <span className="mono-label" style={{ color:"var(--text)", fontSize:11 }}>ACTIVE WORKFLOWS</span>
        <span className="mono-label text-[9px] px-1.5 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-500/10">DAG RUNNER OFFLINE</span>
        <span className="mono-label ml-auto">{workflows.length} PIPELINES</span>
      </div>

      {/* Workflows */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {workflows.map(wf => (
          <motion.div key={wf.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-2.5">
            {/* Workflow name + progress % */}
            <div className="flex items-center justify-between">
              <span className="mono-label" style={{ color:"var(--text)", fontSize:10 }}>{wf.name}</span>
              <span className="mono-label">{wf.progress}%</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full" style={{ background:"var(--border-dim)" }}>
              <motion.div
                className="h-full"
                style={{ background:`linear-gradient(90deg, var(--accent), var(--accent-2, #5B8DEF))` }}
                animate={{ width:`${wf.progress}%` }}
                transition={{ duration:0.6, ease:"easeOut" }}
              />
            </div>
            {/* Steps */}
            <div className="space-y-1.5">
              {wf.steps.map((step, i) => (
                <WorkflowStepNode
                  key={step.id}
                  step={step}
                  isLast={i === wf.steps.length - 1}
                  onStepClick={() => toggleStepStatus(wf.id, step.id)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
