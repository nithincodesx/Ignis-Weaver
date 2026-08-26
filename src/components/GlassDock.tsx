"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ── SVG Icons matching GUILD screenshot ──────────────────────────────────────
function AlienIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("w-5 h-5", cls)} fill="currentColor">
      <path d="M4 1h2v1H4zm6 0h2v1h-2zM3 3h10v1H3zM3 5h1v1H3zm3 0h1v1H6zm4 0h1v1h-1zm3 0h1v1h-1zM2 7h12v1H2zm0 2h2v1H2zm3 0h6v1H5zm7 0h2v1h-2zm-9 2h2v1H3zm8 0h2v1h-2z"/>
    </svg>
  );
}
function BoltIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("w-5 h-5", cls)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function TargetIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("w-5 h-5", cls)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function PlugIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("w-5 h-5", cls)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v8M9 10h6M10 14h4v6a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2z"/><path d="M16 14v-4M8 14v-4"/>
    </svg>
  );
}
function AnalyticsIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("w-5 h-5", cls)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function BrainIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("w-4 h-4", cls)} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2h2v-.07zm6.06-2.63c-.1-.37-.43-.67-.81-.75L15 14v-3c0-.55-.45-1-1-1h-4V8h2c1.1 0 2-.9 2-2V5.5c2.93.9 5.06 3.53 5.06 6.66 0 1.25-.33 2.43-.88 3.47z"/>
    </svg>
  );
}

const NAV = [
  { id: "dashboard", icon: AlienIcon,     label: "Dashboard" },
  { id: "manage",    icon: BoltIcon,      label: "Agents" },
  { id: "workflows", icon: TargetIcon,    label: "Workflows" },
  { id: "analytics", icon: AnalyticsIcon, label: "Analytics" },
  { id: "settings",  icon: PlugIcon,      label: "Settings" },
];

interface SidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  onBrainClick?: () => void;
}

export default function Sidebar({ activePanel, onPanelChange, onBrainClick }: SidebarProps) {
  return (
    <aside className="guild-sidebar flex flex-col justify-between items-center py-4 flex-shrink-0 min-h-screen" style={{ width: 72 }}>
      {/* Nav Items */}
      <nav className="w-full flex flex-col items-center gap-0.5">
        {NAV.map(item => {
          const isActive = activePanel === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPanelChange(item.id)}
              aria-label={item.label}
              className="w-full flex items-center justify-center transition-all duration-150 relative"
              style={{
                height: 60,
                background: isActive ? "var(--card)" : "transparent",
                borderLeft: isActive ? `3px solid var(--accent)` : "3px solid transparent",
                color: isActive ? "var(--text)" : "var(--text-muted)",
              }}
            >
              <Icon cls="" />
            </button>
          );
        })}
      </nav>

      {/* Bottom brain button */}
      <div className="pb-2">
        <button
          onClick={onBrainClick}
          aria-label="Guild AI"
          className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-80"
          style={{ background:"var(--text)", color:"var(--card)" }}
        >
          <BrainIcon />
        </button>
      </div>
    </aside>
  );
}
