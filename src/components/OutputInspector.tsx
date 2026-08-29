"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlatformMetricsData, PlatformMetricsResponse } from "@/lib/apiContracts";
import { Activity, Cpu, Layers, CheckCircle2, Clock, Zap, AlertTriangle, Server, HardDrive } from "lucide-react";

function formatSec(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  return `${h}h ${remM}m`;
}

export default function MetricsPanel() {
  const [data, setData] = useState<PlatformMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/metrics", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as PlatformMetricsResponse;
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch server metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const sys = data?.system;

  return (
    <div className="guild-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-dim)" }}>
        <div className="flex items-center gap-2">
          <Activity size={13} style={{ color: "var(--accent)" }} />
          <span className="mono-label" style={{ color: "var(--text)", fontSize: 11 }}>SERVER TELEMETRY METRICS</span>
        </div>
        <span className="mono-label text-[9px] text-emerald-400">REALTIME POLLED</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {loading && !data && (
          <div className="py-8 text-center text-xs font-mono text-gray-500">Measuring system process metrics...</div>
        )}

        {/* Real KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* KPI 1: Tasks Completed */}
          <div className="p-3 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between mb-1">
              <CheckCircle2 size={13} style={{ color: "#10D9B1" }} />
              <span className="mono-label text-[9px] text-emerald-400">LIVE</span>
            </div>
            <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {data ? data.tasksCompletedToday : 0}
            </p>
            <p className="mono-label text-[10px]">TASKS COMPLETED</p>
          </div>

          {/* KPI 2: Avg Response Latency */}
          <div className="p-3 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between mb-1">
              <Clock size={13} style={{ color: "#5B8DEF" }} />
              <span className="mono-label text-[9px] text-gray-500">TELEMETRY</span>
            </div>
            <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {data && data.avgResponseLatencySec !== null ? `${data.avgResponseLatencySec}s` : "N/A"}
            </p>
            <p className="mono-label text-[10px]">AVG RESPONSE LATENCY</p>
          </div>

          {/* KPI 3: Token Usage */}
          <div className="p-3 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between mb-1">
              <Zap size={13} style={{ color: "#FFB547" }} />
              <span className="mono-label text-[9px] text-gray-500">TELEMETRY</span>
            </div>
            <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {data && data.tokenUsageDisplay !== null ? data.tokenUsageDisplay : "N/A"}
            </p>
            <p className="mono-label text-[10px]">TOKEN USAGE</p>
          </div>

          {/* KPI 4: Error Rate */}
          <div className="p-3 border" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            <div className="flex items-center justify-between mb-1">
              <AlertTriangle size={13} style={{ color: "#FF4D6A" }} />
              <span className="mono-label text-[9px] text-gray-500">STATUS</span>
            </div>
            <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {data && data.errorRatePercent !== null ? `${data.errorRatePercent}%` : "N/A"}
            </p>
            <p className="mono-label text-[10px]">ERROR RATE</p>
          </div>
        </div>

        {/* System Process Runtime Metrics */}
        <div className="p-3 border space-y-3" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--border-dim)" }}>
            <div className="flex items-center gap-1.5">
              <Server size={12} style={{ color: "var(--accent)" }} />
              <span className="mono-label font-bold text-xs" style={{ color: "var(--text)" }}>SYSTEM PROCESS TELEMETRY</span>
            </div>
            <span className="mono-label text-[9px] text-gray-400">NODE RUNTIME</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 border" style={{ borderColor: "var(--border-dim)" }}>
              <span className="mono-label text-[9px] text-gray-400 block">PROCESS UPTIME</span>
              <span className="font-bold text-emerald-400">
                {sys ? formatSec(sys.processUptimeSeconds) : "N/A"}
              </span>
            </div>

            <div className="p-2 border" style={{ borderColor: "var(--border-dim)" }}>
              <span className="mono-label text-[9px] text-gray-400 block">SYSTEM UPTIME</span>
              <span className="font-bold text-blue-400">
                {sys ? formatSec(sys.systemUptimeSeconds) : "N/A"}
              </span>
            </div>

            <div className="p-2 border" style={{ borderColor: "var(--border-dim)" }}>
              <span className="mono-label text-[9px] text-gray-400 block">PROCESS MEMORY (RSS)</span>
              <span className="font-bold text-purple-400">
                {sys ? `${sys.processMemoryRssMb} MB` : "N/A"}
              </span>
            </div>

            <div className="p-2 border" style={{ borderColor: "var(--border-dim)" }}>
              <span className="mono-label text-[9px] text-gray-400 block">HEAP MEMORY USED</span>
              <span className="font-bold text-amber-400">
                {sys ? `${sys.heapUsedMb} MB` : "N/A"}
              </span>
            </div>

            <div className="p-2 border" style={{ borderColor: "var(--border-dim)" }}>
              <span className="mono-label text-[9px] text-gray-400 block">FREE SYSTEM MEMORY</span>
              <span className="font-bold text-cyan-400">
                {sys ? `${(sys.freeSystemMemoryMb / 1024).toFixed(1)} GB / ${(sys.totalSystemMemoryMb / 1024).toFixed(1)} GB` : "N/A"}
              </span>
            </div>

            <div className="p-2 border" style={{ borderColor: "var(--border-dim)" }}>
              <span className="mono-label text-[9px] text-gray-400 block">CPU CORES / MODEL</span>
              <span className="font-bold text-gray-200">
                {sys ? `${sys.cpuCount} Cores` : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Agent Efficiency Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers size={11} style={{ color: "var(--text-muted)" }} />
              <span className="mono-label" style={{ fontSize: 10 }}>BENCHMARK EFFICIENCY</span>
            </div>
            <span className="mono-label text-[9px] text-gray-500">STANDBY (N/A)</span>
          </div>

          <div className="p-3 border text-center text-xs font-mono text-gray-500" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
            Efficiency benchmarking will calculate dynamically upon completing benchmark task suites.
          </div>
        </div>
      </div>
    </div>
  );
}

