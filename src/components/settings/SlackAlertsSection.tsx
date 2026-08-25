"use client";

import React from "react";
import { Bell, RefreshCw } from "lucide-react";

interface SlackAlertsSectionProps {
  webhookUrl: string;
  channel: string;
  onWebhookChange: (val: string) => void;
  onChannelChange: (val: string) => void;
  onTestWebhook: () => void;
  isTesting: boolean;
}

export default function SlackAlertsSection({
  webhookUrl,
  channel,
  onWebhookChange,
  onChannelChange,
  onTestWebhook,
  isTesting,
}: SlackAlertsSectionProps) {
  return (
    <div className="guild-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-dim)" }}>
        <div className="flex items-center gap-2">
          <Bell size={16} style={{ color: "#FF4D6A" }} />
          <div>
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Slack Webhook & Alerting</h3>
            <p className="mono-label text-[10px]">Post real-time agent activity logs and system anomalies to Slack</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onTestWebhook}
          disabled={isTesting}
          className="px-3 py-1.5 border mono-label text-[10px] flex items-center gap-1"
          style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--accent)" }}
        >
          <RefreshCw size={11} className={isTesting ? "animate-spin" : ""} />
          <span>TEST WEBHOOK</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">SLACK INCOMING WEBHOOK URL</label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => onWebhookChange(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="g-input w-full text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">NOTIFICATION CHANNEL</label>
          <input
            type="text"
            value={channel}
            onChange={(e) => onChannelChange(e.target.value)}
            placeholder="#guild-agent-alerts"
            className="g-input w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
}
