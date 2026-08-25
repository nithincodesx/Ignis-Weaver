"use client";

import React from "react";
import { AppSettings } from "@/lib/settingsTypes";

interface AgentExecutionTabProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export default function AgentExecutionTab({ settings, updateSetting }: AgentExecutionTabProps) {
  return (
    <div className="space-y-6">
      <div className="guild-card p-6 space-y-6">
        <div className="border-b pb-3" style={{ borderColor: "var(--border-dim)" }}>
          <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Agent Inference & Runtime Hyperparameters</h3>
          <p className="mono-label text-[10px]">Fine-tune generation temperature, token outputs, and orchestration limits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temperature Slider */}
          <div className="space-y-2 p-4 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between">
              <label className="mono-label font-bold text-xs" style={{ color: "var(--text)" }}>TEMPERATURE</label>
              <span className="font-mono font-bold text-xs px-2 py-0.5 border" style={{ background: "var(--card)", borderColor: "var(--border-dim)", color: "var(--accent)" }}>
                {settings.temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => updateSetting("temperature", parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] mono-label" style={{ color: "var(--text-dim)" }}>
              <span>0.0 (Strict / Code / QA)</span>
              <span>0.5 (Balanced)</span>
              <span>1.0 (Creative / Brainstorm)</span>
            </div>
          </div>

          {/* Max Tokens Slider */}
          <div className="space-y-2 p-4 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between">
              <label className="mono-label font-bold text-xs" style={{ color: "var(--text)" }}>MAX OUTPUT TOKENS</label>
              <span className="font-mono font-bold text-xs px-2 py-0.5 border" style={{ background: "var(--card)", borderColor: "var(--border-dim)", color: "var(--accent)" }}>
                {settings.maxTokens} Tokens
              </span>
            </div>
            <input
              type="range"
              min="512"
              max="16384"
              step="512"
              value={settings.maxTokens}
              onChange={(e) => updateSetting("maxTokens", parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] mono-label" style={{ color: "var(--text-dim)" }}>
              <span>512 (Short Response)</span>
              <span>4096 (Standard)</span>
              <span>16384 (Long Context)</span>
            </div>
          </div>

          {/* Concurrent Tasks */}
          <div className="space-y-2 p-4 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between">
              <label className="mono-label font-bold text-xs" style={{ color: "var(--text)" }}>MAX CONCURRENT AGENTS</label>
              <span className="font-mono font-bold text-xs px-2 py-0.5 border" style={{ background: "var(--card)", borderColor: "var(--border-dim)", color: "var(--accent)" }}>
                {settings.maxConcurrentTasks} Agents Parallel
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={settings.maxConcurrentTasks}
              onChange={(e) => updateSetting("maxConcurrentTasks", parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] mono-label">Controls maximum parallel worker threads running simultaneously.</p>
          </div>

          {/* Timeout Limit */}
          <div className="space-y-2 p-4 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between">
              <label className="mono-label font-bold text-xs" style={{ color: "var(--text)" }}>TASK TIMEOUT (SECONDS)</label>
              <span className="font-mono font-bold text-xs px-2 py-0.5 border" style={{ background: "var(--card)", borderColor: "var(--border-dim)", color: "var(--text)" }}>
                {settings.taskTimeoutSeconds}s
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="600"
              step="30"
              value={settings.taskTimeoutSeconds}
              onChange={(e) => updateSetting("taskTimeoutSeconds", parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] mono-label">Maximum duration before an agent directive times out.</p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div>
              <p className="font-bold text-xs" style={{ color: "var(--text)" }}>Enable Intelligent AI Task Auto-Routing</p>
              <p className="mono-label text-[10px]">Automatically dispatches complex directives to specialized sub-agents based on prompt intent.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableAutoRouting}
              onChange={(e) => updateSetting("enableAutoRouting", e.target.checked)}
              className="w-4 h-4 accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div>
              <p className="font-bold text-xs" style={{ color: "var(--text)" }}>Auto-Retry Failed Agent Operations</p>
              <p className="mono-label text-[10px]">Automatically retries tasks that fail due to API rate limits or network connection drops.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoRetryFailed}
              onChange={(e) => updateSetting("autoRetryFailed", e.target.checked)}
              className="w-4 h-4 accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
