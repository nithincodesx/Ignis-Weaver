"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Sparkles, Cpu, Paperclip, CheckCircle } from "lucide-react";
import { ROLE_CONFIG, AgentRole } from "@/lib/types";

interface CommandConsoleProps {
  onDispatch?: (task: { prompt: string; agent: string; mode: string }) => void;
}

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
  const [isDispatched, setIsDispatched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (onDispatch) {
      onDispatch({
        prompt,
        agent: selectedAgent,
        mode: executionMode,
      });
    }

    setIsDispatched(true);
    setTimeout(() => {
      setIsDispatched(false);
      setPrompt("");
    }, 2500);
  };

  const handleChipClick = (qp: typeof QUICK_PROMPTS[0]) => {
    setPrompt(qp.prompt);
    setSelectedAgent(qp.agent);
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
        <span className="mono-label" style={{ fontSize: 10 }}>SYSTEM: READY</span>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="mono-label flex-shrink-0" style={{ fontSize: 9 }}>QUICK PRESETS:</span>
        {QUICK_PROMPTS.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleChipClick(qp)}
            className="mono-label text-[10px] px-2 py-1 border flex-shrink-0 transition-colors"
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
              className="g-input w-full py-1.5 text-[11px]"
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
              className="g-input w-full py-1.5 text-[11px]"
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
            placeholder="Type directive instructions for the agent network..."
            rows={3}
            className="g-input w-full py-2.5 px-3 text-xs leading-relaxed resize-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 border transition-colors"
              style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--text-muted)" }}
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
              <span className="absolute inset-0 rounded-full opacity-60 g-pulse" style={{ background: "var(--accent)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
            </span>
            <span className="mono-label" style={{ fontSize: 9 }}>
              {selectedAgent ? ROLE_CONFIG[selectedAgent as AgentRole]?.name : "ALL"} READY
            </span>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isDispatched}
            className="flex items-center gap-2 px-5 py-2 mono-label font-bold text-xs border transition-all disabled:opacity-50"
            style={{
              background: "var(--text)",
              color: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {isDispatched ? (
              <>
                <CheckCircle size={14} style={{ color: "#10D9B1" }} />
                <span>DIRECTIVE DISPATCHED</span>
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
    </div>
  );
}
