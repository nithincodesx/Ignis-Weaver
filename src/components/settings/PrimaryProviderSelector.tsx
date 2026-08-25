"use client";

import React from "react";
import { PrimaryProvider } from "@/lib/settingsTypes";

interface PrimaryProviderSelectorProps {
  primaryProvider: PrimaryProvider;
  onSelectProvider: (provider: PrimaryProvider) => void;
}

export default function PrimaryProviderSelector({ primaryProvider, onSelectProvider }: PrimaryProviderSelectorProps) {
  const providers = [
    { id: "openai", name: "OpenAI", desc: "GPT-4o, o1, o3-mini" },
    { id: "anthropic", name: "Anthropic", desc: "Claude 3.5 Sonnet" },
    { id: "gemini", name: "Google Gemini", desc: "Gemini 1.5 Pro / 2.0" },
    { id: "custom", name: "Local / Ollama", desc: "Custom Endpoint" },
  ] as const;

  return (
    <div className="guild-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="mono-label font-bold text-xs" style={{ color: "var(--text)" }}>
          PRIMARY DEFAULT AI ROUTER PROVIDER
        </span>
        <span className="mono-label text-[10px]" style={{ color: "var(--accent)" }}>ACTIVE PROVIDER</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {providers.map((p) => {
          const isSelected = primaryProvider === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectProvider(p.id)}
              className="p-3 border text-left transition-all relative"
              style={{
                background: isSelected ? "var(--surface)" : "var(--card)",
                borderColor: isSelected ? "var(--accent)" : "var(--border-dim)",
              }}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
              )}
              <p className="font-bold text-xs" style={{ color: "var(--text)" }}>{p.name}</p>
              <p className="mono-label text-[10px] mt-0.5">{p.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
