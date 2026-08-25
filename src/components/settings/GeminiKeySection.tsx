"use client";

import React, { useState } from "react";
import { Zap, Copy, RefreshCw, Eye, EyeOff } from "lucide-react";

interface GeminiKeySectionProps {
  apiKey: string;
  model: string;
  onApiKeyChange: (key: string) => void;
  onModelChange: (model: string) => void;
  onPasteClipboard: () => void;
  onTestConnection: () => void;
  isTesting: boolean;
  connectionStatus?: { status: "success" | "error"; msg: string };
}

export default function GeminiKeySection({
  apiKey,
  model,
  onApiKeyChange,
  onModelChange,
  onPasteClipboard,
  onTestConnection,
  isTesting,
  connectionStatus,
}: GeminiKeySectionProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="guild-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: "var(--border-dim)" }}>
        <div className="flex items-center gap-2">
          <Zap size={16} style={{ color: "#FFB547" }} />
          <div>
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Google Gemini API Credentials</h3>
            <p className="mono-label text-[10px]">Powers Multimodal & Context Window Tasks</p>
          </div>
        </div>
        {connectionStatus && (
          <span
            className={`mono-label text-[10px] px-2 py-0.5 border ${
              connectionStatus.status === "success"
                ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                : "text-rose-500 border-rose-500/30 bg-rose-500/10"
            }`}
          >
            {connectionStatus.msg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="mono-label block text-[10px]">GEMINI API KEY (AIZA...)</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="AIzaSy..."
                className="g-input w-full pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button
              type="button"
              onClick={onPasteClipboard}
              className="px-3 py-2 border mono-label text-[10px] flex items-center gap-1 transition-colors hover:bg-white/5"
              style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--text)" }}
            >
              <Copy size={12} />
              <span>PASTE</span>
            </button>
            <button
              type="button"
              onClick={onTestConnection}
              disabled={isTesting}
              className="px-3 py-2 border mono-label text-[10px] flex items-center gap-1 transition-colors"
              style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--accent)" }}
            >
              <RefreshCw size={12} className={isTesting ? "animate-spin" : ""} />
              <span>{isTesting ? "TESTING..." : "TEST"}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">DEFAULT MODEL</label>
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="g-input w-full text-xs"
          >
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (2M Context Window)</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast)</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next Gen)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
