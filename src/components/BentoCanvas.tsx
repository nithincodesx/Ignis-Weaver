"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AgentNode, AGENT_ROLES, ROLE_CONFIG, AgentStatus } from "@/lib/types";
import AgentCard from "./AgentCard";
import { Search, SlidersHorizontal } from "lucide-react";

function generateAgents(): AgentNode[] {
  const statuses: AgentStatus[] = ["active", "completed", "active", "idle", "active", "warning"];
  return AGENT_ROLES.map((role, i) => ({
    id: role,
    role,
    name: ROLE_CONFIG[role].name,
    subtitle: ROLE_CONFIG[role].subtitle,
    status: statuses[i % statuses.length],
    efficiency: [92, 100, 87, 78, 85, 63][i],
    tasksCompleted: [34, 28, 52, 19, 11, 41][i],
    tasksTotal: [40, 28, 60, 25, 14, 50][i],
    lastActive: ["0s", "2m", "0s", "12m", "0s", "5m"][i],
    avatar: ROLE_CONFIG[role].avatar,
    accentColor: ROLE_CONFIG[role].accentColor,
    description: ROLE_CONFIG[role].description,
  }));
}

type FilterStatus = "all" | AgentStatus;

export default function AgentGrid() {
  const [agents] = useState<AgentNode[]>(generateAgents());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filtered = agents.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = agents.filter(a => a.status === "active").length;
  const completedCount = agents.filter(a => a.status === "completed").length;

  return (
    <div className="space-y-5">
      {/* Section header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border-dim)" }}>
        <div>
          <p className="mono-label" style={{ fontSize: 11 }}>
            {agents.length} AGENTS · {activeCount} ACTIVE · {completedCount} COMPLETE
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as FilterStatus)}
            className="g-input text-[11px] py-1.5 pr-6"
            style={{ appearance: "none", backgroundImage: "none" }}
          >
            {["all", "active", "idle", "warning", "error", "completed"].map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH..."
              className="g-input pl-7 py-1.5 text-[11px] w-36"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-12 text-center mono-label">NO AGENTS MATCH FILTER</div>
        )}
      </div>
    </div>
  );
}
