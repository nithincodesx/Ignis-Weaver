"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AgentNode, ROLE_CONFIG } from "@/lib/types";
import StatusPill from "./StatusPill";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface AgentCardProps {
  agent: AgentNode;
  index: number;
}

function ProgressRing({ progress, size = 44, stroke = 2.5, color }: {
  progress: number; size?: number; stroke?: number; color: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} className="progress-ring-track" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        className="progress-ring-fill"
        strokeWidth={stroke}
        stroke={color}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

const RING_COLORS: Record<string, string> = {
  orchestrator: "#10D9B1",
  researcher:   "#5B8DEF",
  developer:    "#8b5cf6",
  analyst:      "#f59e0b",
  designer:     "#ec4899",
  "qa-engineer":"#06b6d4",
};

const TEAM_COLORS: Record<string, string> = {
  purple: "bg-purple-500",
  pink:   "bg-pink-500",
};

function MailIcon()  { return <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style={{color:"var(--text-dim)"}}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>; }
function MeetIcon()  { return <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style={{color:"var(--text-dim)"}}><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>; }
function NotionIcon(){ return <div style={{width:13,height:13,border:"1px solid var(--text-muted)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,fontFamily:"monospace",color:"var(--text-dim)"}}>N</div>; }
function SlackIcon() { return <div style={{width:13,height:13,border:"1px solid var(--text-muted)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,fontFamily:"monospace",color:"var(--text-dim)"}}>S</div>; }
function GithubIcon(){ return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--text-dim)"}}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>; }

export default function AgentCard({ agent, index }: AgentCardProps) {
  const config = ROLE_CONFIG[agent.role];
  const ringColor = RING_COLORS[agent.role] || "#10D9B1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26, delay: index * 0.06 }}
      className="guild-card group flex flex-col p-0 overflow-hidden"
    >
      {/* Card header: AGENT #00X */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b" style={{ borderColor: "var(--border-dim)" }}>
        <span className="mono-label">AGENT</span>
        <span className="mono-label" style={{ color: "var(--text)" }}>#{String(index + 1).padStart(3, "0")}</span>
      </div>

      {/* Split body: Black name block + Avatar */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-0">
        <div className="flex flex-col justify-center items-start px-4 py-5" style={{ background: "var(--text)", minHeight: 110 }}>
          <h3 className="font-extrabold tracking-wide text-base leading-tight font-sans" style={{ color: "var(--card)" }}>
            {config.name}
          </h3>
          <p className="font-mono text-[9px] font-semibold tracking-widest mt-1 uppercase" style={{ color: "#9CA3AF" }}>
            {config.subtitle}
          </p>
        </div>
        <div className="relative border-l overflow-hidden" style={{ borderColor: "var(--border-dim)", minHeight: 110 }}>
          {/* Efficiency ring overlay */}
          <div className="absolute top-2 right-2 z-10">
            <ProgressRing progress={agent.efficiency} size={40} stroke={2} color={ringColor} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold" style={{ color: "var(--text)" }}>
              {Math.round(agent.efficiency)}%
            </span>
          </div>
          <Image
            src={config.avatar}
            alt={config.name}
            fill
            className="object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      </div>

      {/* Status + Last active */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-b" style={{ borderColor: "var(--border-dim)" }}>
        <StatusPill status={agent.status} size="sm" />
        <span className="mono-label">{agent.lastActive} ago</span>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="mono-label mb-1">DESCRIPTION</p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>{config.description}</p>
      </div>

      {/* Teams */}
      <div className="px-4 pb-3">
        <p className="mono-label mb-2">TEAMS</p>
        <div className="flex items-center gap-1.5">
          {config.teams.map(t => (
            <div key={t.id} className={cn("w-6 h-6 flex items-center justify-center text-white text-xs rounded-none", TEAM_COLORS[t.color] || "bg-gray-500")}>
              {t.icon}
            </div>
          ))}
          <button className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-none" style={{ background: "var(--surface)", border: "1px solid var(--border-dim)", color: "var(--text-dim)" }}>+</button>
        </div>
      </div>

      {/* Connections */}
      <div className="px-4 pb-4">
        <p className="mono-label mb-2">CONNECTIONS</p>
        <div className="flex items-center gap-1.5">
          {config.connections.map(c => (
            <div key={c.id} title={c.label} className="w-5 h-5 flex items-center justify-center">
              {c.type === "mail"   && <MailIcon />}
              {c.type === "meet"   && <MeetIcon />}
              {c.type === "notion" && <NotionIcon />}
              {c.type === "slack"  && <SlackIcon />}
              {c.type === "github" && <GithubIcon />}
            </div>
          ))}
          <span className="mono-label ml-1">+{Math.floor(Math.random() * 4) + 1}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border-t" style={{ borderColor: "var(--border-dim)" }}>
        {[
          { label: "Done", val: agent.tasksCompleted },
          { label: "Total", val: agent.tasksTotal },
          { label: "Eff.", val: `${Math.round(agent.efficiency)}%` },
        ].map((s, i) => (
          <div key={s.label} className={cn("py-2.5 flex flex-col items-center", i < 2 && "border-r")} style={{ borderColor: "var(--border-dim)" }}>
            <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{s.val}</span>
            <span className="mono-label">{s.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
