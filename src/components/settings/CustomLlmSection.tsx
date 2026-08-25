"use client";

import React from "react";
import { Server } from "lucide-react";

interface CustomLlmSectionProps {
  baseUrl: string;
  apiKey: string;
  model: string;
  onBaseUrlChange: (url: string) => void;
  onApiKeyChange: (key: string) => void;
  onModelChange: (model: string) => void;
}

export default function CustomLlmSection({
  baseUrl,
  apiKey,
  model,
  onBaseUrlChange,
  onApiKeyChange,
  onModelChange,
}: CustomLlmSectionProps) {
  return (
    <div className="guild-card p-5 space-y-4">
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border-dim)" }}>
        <Server size={16} style={{ color: "var(--accent)" }} />
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Custom LLM / Local Server (Ollama / OpenRouter / vLLM)</h3>
          <p className="mono-label text-[10px]">Connect self-hosted local LLMs or custom OpenAI-compatible proxies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">BASE URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => onBaseUrlChange(e.target.value)}
            placeholder="http://localhost:11434/v1"
            className="g-input w-full text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">API KEY (OPTIONAL FOR OLLAMA)</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Bearer token or sk-..."
            className="g-input w-full text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">MODEL NAME</label>
          <input
            type="text"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="llama3:latest or deepseek-r1"
            className="g-input w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
}
