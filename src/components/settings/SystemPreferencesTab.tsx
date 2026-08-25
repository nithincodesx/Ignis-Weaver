"use client";

import React from "react";
import { AppSettings, LogVerbosity } from "@/lib/settingsTypes";

interface SystemPreferencesTabProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export default function SystemPreferencesTab({ settings, updateSetting }: SystemPreferencesTabProps) {
  return (
    <div className="space-y-6">
      <div className="guild-card p-6 space-y-6">
        <div className="border-b pb-3" style={{ borderColor: "var(--border-dim)" }}>
          <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>System & UI Environment Settings</h3>
          <p className="mono-label text-[10px]">Configure logging depth, privacy masking, and UI dashboard refresh rates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auto Refresh Frequency */}
          <div className="space-y-1.5">
            <label className="mono-label block text-[10px]">DASHBOARD REFRESH INTERVAL</label>
            <select
              value={settings.refreshInterval}
              onChange={(e) => updateSetting("refreshInterval", parseInt(e.target.value))}
              className="g-input w-full text-xs"
            >
              <option value={2}>Every 2 Seconds (High Frequency)</option>
              <option value={5}>Every 5 Seconds (Recommended)</option>
              <option value={10}>Every 10 Seconds</option>
              <option value={30}>Every 30 Seconds</option>
              <option value={0}>Disabled (Manual Refresh Only)</option>
            </select>
          </div>

          {/* Log Verbosity */}
          <div className="space-y-1.5">
            <label className="mono-label block text-[10px]">LOG VERBOSITY LEVEL</label>
            <select
              value={settings.logVerbosity}
              onChange={(e) => updateSetting("logVerbosity", e.target.value as LogVerbosity)}
              className="g-input w-full text-xs"
            >
              <option value="debug">DEBUG (Verbose agent thinking logs)</option>
              <option value="info">INFO (Standard activity feed)</option>
              <option value="warn">WARN (Only show warnings and errors)</option>
              <option value="error">ERROR (Critical alerts only)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div>
              <p className="font-bold text-xs" style={{ color: "var(--text)" }}>Audio Alerts & Sound FX</p>
              <p className="mono-label text-[10px]">Play subtle cyber sound cues when agents finish tasks or hit errors.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundAlerts}
              onChange={(e) => updateSetting("soundAlerts", e.target.checked)}
              className="w-4 h-4 accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div>
              <p className="font-bold text-xs" style={{ color: "var(--text)" }}>Privacy & PII Masking Mode</p>
              <p className="mono-label text-[10px]">Automatically redact email addresses, passwords, and tokens from live console logs.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacyMode}
              onChange={(e) => updateSetting("privacyMode", e.target.checked)}
              className="w-4 h-4 accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
