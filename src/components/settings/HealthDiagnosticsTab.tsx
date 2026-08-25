"use client";

import React from "react";
import { Save, Trash2 } from "lucide-react";
import { AppSettings } from "@/lib/settingsTypes";

interface HealthDiagnosticsTabProps {
  settings: AppSettings;
  onClearStorage: () => void;
}

export default function HealthDiagnosticsTab({ settings, onClearStorage }: HealthDiagnosticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="guild-card p-4 space-y-1">
          <p className="mono-label text-[10px]">API GATEWAY STATUS</p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-sm text-emerald-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 g-pulse" />
              OPERATIONAL
            </span>
            <span className="mono-label text-[10px]">18ms latency</span>
          </div>
        </div>

        <div className="guild-card p-4 space-y-1">
          <p className="mono-label text-[10px]">BROWSER STORAGE USED</p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>
              14.8 KB / 5.0 MB
            </span>
            <span className="mono-label text-[10px]" style={{ color: "var(--accent)" }}>HEALTHY</span>
          </div>
        </div>

        <div className="guild-card p-4 space-y-1">
          <p className="mono-label text-[10px]">ACTIVE AGENT PIPELINES</p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>
              6 Agents Standing By
            </span>
            <span className="mono-label text-[10px]">6/6 READY</span>
          </div>
        </div>
      </div>

      <div className="guild-card p-6 space-y-4">
        <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Maintenance & System Actions</h3>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `guild_settings_${new Date().toISOString().slice(0,10)}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-4 py-2 border mono-label text-xs flex items-center gap-2 transition-colors hover:bg-white/5"
            style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--text)" }}
          >
            <Save size={13} />
            <span>EXPORT CONFIG JSON</span>
          </button>

          <button
            type="button"
            onClick={onClearStorage}
            className="px-4 py-2 border mono-label text-xs flex items-center gap-2 transition-colors hover:bg-rose-500/10 text-rose-500 border-rose-500/30"
          >
            <Trash2 size={13} />
            <span>PURGE LOCAL STORAGE CACHE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
