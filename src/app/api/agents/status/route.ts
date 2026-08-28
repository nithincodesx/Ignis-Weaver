import { NextRequest, NextResponse } from "next/server";
import { AgentStatusResponse, AgentStatusOverview, AgentExecutionState } from "@/lib/apiContracts";
import { ROLE_CONFIG, AgentNode, AgentStatus } from "@/lib/types";
import { getAgentRegistry, formatLastActive } from "@/lib/agentRegistry";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const timestamp = new Date().toISOString();
  const searchParams = req.nextUrl.searchParams;
  const statusFilter = searchParams.get("status") as AgentStatus | null;

  const registryRecords = getAgentRegistry();

  const agents: AgentNode[] = registryRecords.map((rec) => {
    const config = ROLE_CONFIG[rec.agentId];
    return {
      id: rec.agentId,
      role: rec.agentId,
      name: rec.name,
      subtitle: rec.subtitle,
      status: rec.status,
      // Leave efficiency undefined if no real calculation data, rendering "N/A"
      efficiency: 0,
      tasksCompleted: rec.completedTasks,
      tasksTotal: rec.completedTasks + rec.failureCount,
      lastActive: formatLastActive(rec.lastHeartbeat),
      avatar: config.avatar,
      accentColor: config.accentColor,
      description: config.description,
    };
  });

  const filteredAgents = statusFilter
    ? agents.filter((a) => a.status === statusFilter)
    : agents;

  const executionStates: AgentExecutionState[] = registryRecords.map((rec) => ({
    agentId: rec.agentId,
    status: rec.status,
    efficiencyPercent: 0,
    activeThreads: rec.status === "active" ? 1 : 0,
    memoryUsageMb: 0,
    lastHeartbeat: rec.lastHeartbeat || timestamp,
  }));

  const overview: AgentStatusOverview = {
    agents: filteredAgents,
    executionStates,
    summary: {
      totalAgents: agents.length,
      activeCount: agents.filter((a) => a.status === "active").length,
      idleCount: agents.filter((a) => a.status === "idle").length,
      completedCount: agents.filter((a) => a.status === "completed").length,
      warningCount: agents.filter((a) => a.status === "warning").length,
      errorCount: agents.filter((a) => a.status === "error").length,
    },
  };

  const response: AgentStatusResponse = {
    success: true,
    data: overview,
    timestamp,
  };

  return NextResponse.json(response, { status: 200 });
}

