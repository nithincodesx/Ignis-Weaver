"use client";

import React from "react";
import { Key, Sliders, Share2, Monitor, ShieldCheck } from "lucide-react";

export type SettingsTabId = "api" | "execution" | "integrations" | "system" | "health";

interface SettingsTabNavProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

export const SETTINGS_TABS = [
  { id: "api", label: "API KEYS & MODELS", icon: Key },
  { id: "execution", label: "AGENT EXECUTION", icon: Sliders },
  { id: "integrations", label: "INTEGRATIONS", icon: Share2 },
  { id: "system", label: "PREFERENCES", icon: Monitor },
  { id: "health", label: "HEALTH & DIAGNOSTICS", icon: ShieldCheck },
] as const;

export default function SettingsTabNav({ activeTab, onTabChange }: SettingsTabNavProps) {
  return (
    <div className="flex items-center gap-1 border-b overflow-x-auto pb-0.5" style={{ borderColor: "var(--border-dim)" }}>
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as SettingsTabId)}
            className="flex items-center gap-2 px-4 py-2.5 mono-label text-xs transition-all relative flex-shrink-0"
            style={{
              background: isActive ? "var(--card)" : "transparent",
              color: isActive ? "var(--text)" : "var(--text-muted)",
              borderTop: isActive ? "2px solid var(--accent)" : "2px solid transparent",
              borderLeft: isActive ? "1px solid var(--border-dim)" : "1px solid transparent",
              borderRight: isActive ? "1px solid var(--border-dim)" : "1px solid transparent",
            }}
          >
            <Icon size={14} style={{ color: isActive ? "var(--accent)" : "currentColor" }} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
