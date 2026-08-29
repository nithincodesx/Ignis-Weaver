"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentExecutionEvent, AgentEventType } from "@/lib/apiContracts";
import { CheckCircle2, PlayCircle, AlertTriangle, Lightbulb, Rocket, RefreshCw, Cpu, Layers, Loader2, Play, Square } from "lucide-react";

export type StreamState = "idle" | "connecting" | "receiving events" | "completed" | "error";

const eventIconMap: Record<AgentEventType, React.ElementType> = {
  task_received: PlayCircle,
  agent_selected: Cpu,
  provider_started: Rocket,
  provider_completed: CheckCircle2,
  workflow_step_started: Layers,
  workflow_step_completed: CheckCircle2,
  task_completed: CheckCircle2,
  task_failed: AlertTriangle,
};

const eventColorMap: Record<AgentEventType, string> = {
  task_received: "#5B8DEF",
  agent_selected: "#8b5cf6",
  provider_started: "#00C9FF",
  provider_completed: "#10D9B1",
  workflow_step_started: "#f59e0b",
  workflow_step_completed: "#10D9B1",
  task_completed: "#10D9B1",
  task_failed: "#FF4D6A",
};

function fmtTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  } catch {
    return iso;
  }
}

export default function ActivityFeed() {
  const [streamState, setStreamState] = useState<StreamState>("idle");
  const [events, setEvents] = useState<AgentExecutionEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const seenEventIdsRef = useRef<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setStreamState("connecting");
    setErrorMessage(null);

    const taskId = `task-${Date.now()}`;
    const url = `/api/agent/events?taskId=${taskId}&agentId=orchestrator`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setStreamState("receiving events");
    };

    es.onmessage = (e) => {
      try {
        const evt = JSON.parse(e.data) as AgentExecutionEvent;
        if (!evt || !evt.eventId) return;

        // Deduplicate events
        if (seenEventIdsRef.current.has(evt.eventId)) return;
        seenEventIdsRef.current.add(evt.eventId);

        setEvents((prev) => [...prev, evt]);

        if (evt.type === "task_completed" || evt.type === "task_failed") {
          setStreamState("completed");
          es.close();
          eventSourceRef.current = null;
        }
      } catch (err) {
        console.error("Failed to parse SSE event payload:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE connection error:", err);
      setStreamState("error");
      setErrorMessage("Event stream connection lost or interrupted.");
      es.close();
      eventSourceRef.current = null;
    };
  };

  const stopStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStreamState("idle");
  };

  useEffect(() => {
    startStream();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="guild-card flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-dim)" }}>
        <div className="flex items-center gap-2">
          <span className="mono-label" style={{ color: "var(--text)" }}>LIVE EXECUTION FEED</span>
          <span className="mono-label text-[10px]" style={{
            color: streamState === "receiving events" ? "#10D9B1" : streamState === "connecting" ? "#FFB547" : streamState === "error" ? "#FF4D6A" : "var(--text-muted)"
          }}>
            [{streamState.toUpperCase()}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {streamState === "receiving events" || streamState === "connecting" ? (
            <button
              onClick={stopStream}
              aria-label="Stop live execution stream"
              className="p-1 border transition-colors hover:bg-white/10"
              style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--text-dim)" }}
              title="Stop Stream"
            >
              <Square size={12} />
            </button>
          ) : (
            <button
              onClick={startStream}
              aria-label="Restart live execution stream"
              className="p-1 border transition-colors hover:bg-white/10"
              style={{ background: "var(--surface)", borderColor: "var(--border-dim)", color: "var(--accent)" }}
              title="Start / Restart Stream"
            >
              <Play size={12} />
            </button>
          )}

          <div className="flex items-center gap-1.5 pl-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full opacity-60 g-pulse" style={{ background: streamState === "error" ? "#FF4D6A" : "var(--accent)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: streamState === "error" ? "#FF4D6A" : "var(--accent)" }} />
            </span>
            <span className="mono-label" style={{ color: streamState === "error" ? "#FF4D6A" : "var(--accent)" }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Stream Status Banner */}
      {streamState === "connecting" && (
        <div className="px-4 py-2 border-b bg-amber-500/10 border-amber-500/20 text-amber-400 text-xs font-mono flex items-center gap-2">
          <Loader2 size={13} className="animate-spin" />
          <span>CONNECTING TO BACKEND SSE STREAM...</span>
        </div>
      )}

      {streamState === "error" && errorMessage && (
        <div className="px-4 py-2 border-b bg-rose-500/10 border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertTriangle size={13} />
          <span>STREAM ERROR: {errorMessage}</span>
        </div>
      )}

      {/* Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {events.length === 0 && streamState !== "connecting" && (
          <div className="text-center py-8 text-xs font-mono text-gray-500">
            Waiting for backend execution events...
          </div>
        )}

        <AnimatePresence initial={false}>
          {events.map((act) => {
            const Icon = eventIconMap[act.type] || CheckCircle2;
            const color = eventColorMap[act.type] || "var(--accent)";
            return (
              <motion.div
                key={act.eventId}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="activity-item py-2.5 group relative pl-5"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-3.5 w-[11px] h-[11px] flex items-center justify-center" style={{ background: "var(--card)", border: "1px solid var(--border-dim)" }}>
                  <Icon size={7} style={{ color }} />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold font-mono" style={{ color: "var(--text)" }}>{act.agentName}</span>
                      <span className="mono-label text-[10px] text-gray-500">{fmtTime(act.timestamp)}</span>
                      <span className="mono-label text-[9px] px-1 py-0.5 border" style={{ borderColor: "var(--border-dim)", color }}>
                        {act.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-mono" style={{ color: "var(--text-dim)" }}>{act.message}</p>
                    {act.metadata && (
                      <span className="inline-block mt-1 mono-label px-1.5 py-0.5" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
                        {act.metadata}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

