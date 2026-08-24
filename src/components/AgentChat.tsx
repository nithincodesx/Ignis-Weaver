"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityLogEntry, ActivityType, AgentRole } from "@/lib/types";
import { CheckCircle2, PlayCircle, AlertTriangle, Lightbulb, Rocket, RefreshCw } from "lucide-react";

const activityIconMap: Record<ActivityType, React.ComponentType<{ size?: number; className?: string }>> = {
  task_complete: CheckCircle2,
  agent_started: PlayCircle,
  alert: AlertTriangle,
  insight: Lightbulb,
  deploy: Rocket,
  sync: RefreshCw,
};

const activityColorMap: Record<ActivityType, string> = {
  task_complete: "#10D9B1",
  agent_started: "#5B8DEF",
  alert: "#FFB547",
  insight: "#f59e0b",
  deploy: "#00C9FF",
  sync: "#8b5cf6",
};

const INITIAL: ActivityLogEntry[] = [
  { id:"a1", type:"agent_started", agent:"orchestrator", agentName:"PAUL", message:"Initialized multi-agent pipeline with 6 nodes", timestamp: new Date(Date.now()-120000), metadata:"Latency: 12ms" },
  { id:"a2", type:"task_complete", agent:"researcher",   agentName:"MARCO", message:"Data synthesis complete — 847 sources analyzed", timestamp: new Date(Date.now()-95000),  metadata:"Duration: 4.2s" },
  { id:"a3", type:"insight",       agent:"analyst",      agentName:"ALEXIS", message:"ROI projection: 340% over 18 months. Risk: LOW", timestamp: new Date(Date.now()-70000) },
  { id:"a4", type:"deploy",        agent:"developer",    agentName:"VIKTOR", message:"Auth module deployed to staging — 47 files compiled", timestamp: new Date(Date.now()-45000), metadata:"Coverage: 94.2%" },
  { id:"a5", type:"alert",         agent:"qa-engineer",  agentName:"ELENA",  message:"2 flaky tests detected in integration suite",  timestamp: new Date(Date.now()-30000), metadata:"Retry scheduled" },
  { id:"a6", type:"sync",          agent:"orchestrator", agentName:"PAUL",   message:"Cross-department sync complete. Alignment: 96.7%", timestamp: new Date(Date.now()-10000) },
];

const LIVE_POOL: Omit<ActivityLogEntry,"id"|"timestamp">[] = [
  { type:"task_complete", agent:"designer",     agentName:"SARAH",  message:"UI component library updated — 12 new components" },
  { type:"insight",       agent:"researcher",   agentName:"MARCO",  message:"Market anomaly detected in APAC region — TAM: $2.1B" },
  { type:"deploy",        agent:"developer",    agentName:"VIKTOR", message:"API Gateway v2.1 pushed to production" },
  { type:"task_complete", agent:"analyst",      agentName:"ALEXIS", message:"Cash flow projection updated — runway: 24 months" },
  { type:"sync",          agent:"orchestrator", agentName:"PAUL",   message:"All agents re-calibrated. Performance delta: +8.3%" },
  { type:"agent_started", agent:"qa-engineer",  agentName:"ELENA",  message:"Regression test suite initiated — 342 cases" },
];

function fmtTime(d: Date) { return d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }); }

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>(INITIAL);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.45) {
        const tmpl = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
        setActivities(prev => [...prev.slice(-14), { ...tmpl, id:`live-${Date.now()}`, timestamp: new Date() }]);
      }
    }, 5500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activities]);

  return (
    <div className="guild-card flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor:"var(--border-dim)" }}>
        <span className="mono-label" style={{ color:"var(--text)" }}>ACTIVITY LOG</span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full opacity-60 g-pulse" style={{ background:"var(--accent)" }}/>
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background:"var(--accent)" }}/>
          </span>
          <span className="mono-label" style={{ color:"var(--accent)" }}>LIVE</span>
        </div>
      </div>

      {/* Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        <AnimatePresence initial={false}>
          {activities.map(act => {
            const Icon = activityIconMap[act.type];
            const color = activityColorMap[act.type];
            return (
              <motion.div
                key={act.id}
                initial={{ opacity:0, y:6, scale:0.98 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ type:"spring", stiffness:380, damping:28 }}
                className="activity-item py-2.5 group"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-3.5 w-[11px] h-[11px] flex items-center justify-center" style={{ background:"var(--card)", border:"1px solid var(--border-dim)" }}>
                  <Icon size={7} style={{ color }} />
                </div>
                {/* Content */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold font-mono" style={{ color:"var(--text)" }}>{act.agentName}</span>
                      <span className="mono-label">{fmtTime(act.timestamp)}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color:"var(--text-dim)" }}>{act.message}</p>
                    {act.metadata && (
                      <span className="inline-block mt-1 mono-label px-1.5 py-0.5" style={{ background:"var(--surface)", color:"var(--text-muted)" }}>{act.metadata}</span>
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
