"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Sparkles, Cpu, Paperclip, CheckCircle, FileText, X, Loader2, AlertTriangle } from "lucide-react";
import { ROLE_CONFIG, AgentRole } from "@/lib/types";
import { loadSettingsFromStorage } from "@/lib/settingsStorage";
import { AgentDispatchResponse } from "@/lib/apiContracts";

interface CommandConsoleProps {
  onDispatch?: (task: { prompt: string; agent: string; mode: string }) => void;
}

export type DispatchState = "idle" | "submitting" | "running" | "success" | "error";

const QUICK_PROMPTS = [
  { label: "⚡ Market Audit", prompt: "Run comprehensive market analysis across APAC tech sector", agent: "researcher" },
  { label: "💻 Generate API", prompt: "Build RESTful API endpoints for user auth & JWT verification", agent: "developer" },
  { label: "🔍 Security Scan", prompt: "Audit integration test suite for memory leak anomalies", agent: "qa-engineer" },
  { label: "📊 Financial Forecast", prompt: "Calculate 18-month cash flow projections and ROI", agent: "analyst" },
];

export default function CommandConsole({ onDispatch }: CommandConsoleProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("orchestrator");
  const [executionMode, setExecutionMode] = useState<string>("autonomous");
  const [dispatchState, setDispatchState] = useState<DispatchState>("idle");
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || dispatchState === "submitting" || dispatchState === "running") return;

    setDispatchState("submitting");
    setErrorMessage(null);
    setExecutionOutput(null);

    const settings = loadSettingsFromStorage();
    const finalPrompt = attachedFile ? `[Attachment: ${attachedFile}]\n${cleanPrompt}` : cleanPrompt;

    try {
      setDispatchState("running");
      const res = await fetch("/api/agent/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-primary-provider": settings.primaryProvider || "openai",
          "x-openai-key": settings.openaiApiKey || "",
          "x-anthropic-key": settings.anthropicApiKey || "",
          "x-gemini-key": settings.geminiApiKey || "",
          "x-custom-url": settings.customBaseUrl || "",
          "x-custom-key": settings.customApiKey || "",
          "x-openai-model": settings.openaiModel || "",
          "x-anthropic-model": settings.anthropicModel || "",
          "x-gemini-model": settings.geminiModel || "",
          "x-custom-model": settings.customModel || "",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          agentId: selectedAgent,
          mode: executionMode,
        }),
      });

      const json = (await res.json()) as AgentDispatchResponse;

      if (!res.ok || !json.success || !json.data) {
        setDispatchState("error");
        setErrorMessage(json.error?.message || `Execution failed with HTTP status ${res.status}`);
        return;
      }

      setDispatchState("success");
      setExecutionOutput(json.data.outputSummary || "Task completed.");

      if (onDispatch) {
        onDispatch({
          prompt: finalPrompt,
          agent: selectedAgent,
          mode: executionMode,
        });
      }

      setPrompt("");
      setAttachedFile(null);
    } catch (err) {
      setDispatchState("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to communicate with task dispatch API.");
    }
  };

  const handleChipClick = (qp: typeof QUICK_PROMPTS[0]) => {
    setPrompt(qp.prompt);
    setSelectedAgent(qp.agent);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
  };

  return (
    <div className="guild-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border-dim)" }}>
        <div className="flex items-center gap-2">
          <Terminal size={14} style={{ color: "var(--accent)" }} />
          <span className="mono-label" style={{ color: "var(--text)", fontSize: 11 }}>
            DISPATCH AGENT DIRECTIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mono-label text-[10px]" style={{ color: dispatchState === "error" ? "#FF4D6A" : dispatchState === "success" ? "#10D9B1" : dispatchState === "running" ? "#FFB547" : "var(--text-muted)" }}>
            STATE: {dispatchState.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="mono-label flex-shrink-0" style={{ fontSize: 9 }}>QUICK PRESETS:</span>
        {QUICK_PROMPTS.map((qp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleChipClick(qp)}
            disabled={dispatchState === "submitting" || dispatchState === "running"}
            className="mono-label text-[10px] px-2 py-1 border flex-shrink-0 transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border-dim)",
              color: "var(--text)",
            }}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Target Agent Selector */}
          <div>
            <label className="mono-label block mb-1">TARGET AGENT</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              disabled={dispatchState === "submitting" || dispatchState === "running"}
              className="g-input w-full py-1.5 text-[11px] disabled:opacity-50"
            >
              <option value="orchestrator">PAUL — ORCHESTRATOR (ALL)</option>
              <option value="researcher">MARCO — USER RESEARCHER</option>
              <option value="developer">VIKTOR — BACKEND ENGINEER</option>
              <option value="analyst">ALEXIS — PRODUCT ANALYST</option>
              <option value="designer">SARAH — UX DESIGNER</option>
              <option value="qa-engineer">ELENA — QA AUDITOR</option>
            </select>
          </div>

          {/* Execution Mode Selector */}
          <div>
            <label className="mono-label block mb-1">EXECUTION MODE</label>
            <select
              value={executionMode}
              onChange={(e) => setExecutionMode(e.target.value)}
              disabled={dispatchState === "submitting" || dispatchState === "running"}
              className="g-input w-full py-1.5 text-[11px] disabled:opacity-50"
            >
              <option value="autonomous">⚡ AUTONOMOUS (FULL AUTO)</option>
              <option value="hitl">👤 HUMAN-IN-THE-LOOP (APPROVAL REQUIRED)</option>
              <option value="dry-run">🧪 DRY-RUN (SIMULATION ONLY)</option>
            </select>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={dispatchState === "submitting" || dispatchState === "running"}
            placeholder="Type directive instructions for the agent network..."
            rows={3}
            className="g-input w-full py-2.5 px-3 text-xs leading-relaxed resize-none disabled:opacity-50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          {attachedFile && (
            <div className="absolute left-3 bottom-3 flex items-center gap-1.5 px-2 py-0.5 border text-[10px] mono-label bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
              <FileText size={11} />
              <span>{attachedFile}</span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="ml-1 text-gray-400 hover:text-white"
              >
                <X size={11} />
              </button>
            </div>
          )}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={dispatchState === "submitting" || dispatchState === "running"}
              className="p-1.5 border transition-colors hover:bg-white/10 disabled:opacity-50"
              style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: attachedFile ? "var(--accent)" : "var(--text-muted)" }}
              title="Attach File / Context"
            >
              <Paperclip size={13} />
            </button>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full opacity-60 g-pulse" style={{ background: dispatchState === "error" ? "#FF4D6A" : "var(--accent)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: dispatchState === "error" ? "#FF4D6A" : "var(--accent)" }} />
            </span>
            <span className="mono-label" style={{ fontSize: 9 }}>
              {selectedAgent ? ROLE_CONFIG[selectedAgent as AgentRole]?.name : "ALL"} READY
            </span>
          </div>

          <button
            type="submit"
            aria-label="Dispatch directive to active agent network"
            disabled={!prompt.trim() || dispatchState === "submitting" || dispatchState === "running"}
            className="flex items-center gap-2 px-5 py-2 mono-label font-bold text-xs border transition-all disabled:opacity-50"
            style={{
              background: "var(--text)",
              color: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {dispatchState === "submitting" ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>SUBMITTING...</span>
              </>
            ) : dispatchState === "running" ? (
              <>
                <Loader2 size={13} className="animate-spin text-amber-400" />
                <span>EXECUTING DIRECTIVE...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>DISPATCH DIRECTIVE</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Real Response Output or Error Feedback */}
      <AnimatePresence>
        {dispatchState === "error" && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 border flex items-start gap-2 text-xs font-mono bg-rose-500/10 border-rose-500/30 text-rose-400"
          >
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1">
              <p className="font-bold text-[11px] uppercase tracking-wider">Execution Failed</p>
              <p className="mt-1 text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {dispatchState === "success" && executionOutput && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 border space-y-1.5 bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
              <span className="font-bold text-[11px] mono-label flex items-center gap-1 text-emerald-400">
                <CheckCircle size={13} />
                <span>DIRECTIVE RESPONSE COMPLETED</span>
              </span>
              <span className="mono-label text-[9px] text-emerald-500">[REAL AGENT OUTPUT]</span>
            </div>
            <p className="text-xs font-mono leading-relaxed whitespace-pre-wrap pt-1 text-gray-200">
              {executionOutput}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

