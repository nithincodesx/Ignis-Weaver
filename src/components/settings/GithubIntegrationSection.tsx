"use client";

import React, { useState } from "react";
import { Terminal, RefreshCw, Eye, EyeOff } from "lucide-react";

interface GithubIntegrationSectionProps {
  token: string;
  repo: string;
  onTokenChange: (val: string) => void;
  onRepoChange: (val: string) => void;
  onVerify: () => void;
  isTesting: boolean;
}

export default function GithubIntegrationSection({
  token,
  repo,
  onTokenChange,
  onRepoChange,
  onVerify,
  isTesting,
}: GithubIntegrationSectionProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="guild-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-dim)" }}>
        <div className="flex items-center gap-2">
          <Terminal size={16} style={{ color: "var(--accent)" }} />
          <div>
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>GitHub Workspace Integration</h3>
            <p className="mono-label text-[10px]">Allows developer agents to submit pull requests and commit code</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onVerify}
          disabled={isTesting}
          className="px-3 py-1.5 border mono-label text-[10px] flex items-center gap-1"
          style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--accent)" }}
        >
          <RefreshCw size={11} className={isTesting ? "animate-spin" : ""} />
          <span>VERIFY PAT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">GITHUB PERSONAL ACCESS TOKEN (PAT)</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={token}
              onChange={(e) => onTokenChange(e.target.value)}
              placeholder="ghp_..."
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
        </div>
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">DEFAULT REPOSITORY (OWNER/REPO)</label>
          <input
            type="text"
            value={repo}
            onChange={(e) => onRepoChange(e.target.value)}
            placeholder="nithincodesx/Ignis-Weaver"
            className="g-input w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
}
