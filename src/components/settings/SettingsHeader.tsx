"use client";

import React from "react";
import { Sliders, Save, RotateCcw } from "lucide-react";

interface SettingsHeaderProps {
  saveSuccess: boolean;
  onSave: () => void;
  onReset: () => void;
}

export default function SettingsHeader({ saveSuccess, onSave, onReset }: SettingsHeaderProps) {
  return (
    <div className="guild-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <Sliders size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight" style={{ color: "var(--text)" }}>
              SYSTEM CONFIGURATION & API KEYS
            </h2>
            <p className="mono-label mt-0.5 text-[11px]" style={{ color: "var(--text-dim)" }}>
              Manage LLM Provider Credentials, Autonomous Agent Rules & Workspace Integrations
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 mono-label text-xs border transition-colors hover:opacity-80"
          style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--text-dim)" }}
        >
          <RotateCcw size={13} />
          <span>RESET DEFAULTS</span>
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-5 py-2 mono-label font-bold text-xs border transition-all shadow-sm"
          style={{ background: "var(--text)", color: "var(--card)", borderColor: "var(--border)" }}
        >
          <Save size={14} style={{ color: saveSuccess ? "#10D9B1" : "currentColor" }} />
          <span>{saveSuccess ? "SETTINGS SAVED!" : "SAVE ALL CONFIG"}</span>
        </button>
      </div>
    </div>
  );
}
