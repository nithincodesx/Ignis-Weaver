"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AgentNode, AGENT_ROLES, ROLE_CONFIG, AgentStatus } from "@/lib/types";
import { AgentStatusResponse } from "@/lib/apiContracts";
import AgentCard from "./AgentCard";
import { Search } from "lucide-react";

function getInitialAgentNodes(): AgentNode[] {
  return AGENT_ROLES.map((role) => ({
    id: role,
    role,
    name: ROLE_CONFIG[role].name,
    subtitle: ROLE_CONFIG[role].subtitle,
    status: "idle" as AgentStatus,
    efficiency: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
    lastActive: "N/A",
    avatar: ROLE_CONFIG[role].avatar,
    accentColor: ROLE_CONFIG[role].accentColor,
    description: ROLE_CONFIG[role].description,
  }));
}

type FilterStatus = "all" | AgentStatus;

export default function AgentGrid() {
  const [agents, setAgents] = useState<AgentNode[]>(getInitialAgentNodes());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const fetchAgentStatus = async () => {
    try {
      const res = await fetch("/api/agents/status", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as AgentStatusResponse;
        if (json.success && json.data?.agents) {
          setAgents(json.data.agents);
        }
      }
    } catch (err) {
      console.error("Failed to fetch agent status from backend API:", err);
    }
  };

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 3000);
    return () => clearInterval(interval);
  }, []);

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

