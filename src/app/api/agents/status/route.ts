import { NextRequest, NextResponse } from "next/server";
import { AgentStatusResponse, AgentStatusOverview, AgentExecutionState } from "@/lib/apiContracts";
import { AGENT_ROLES, ROLE_CONFIG, AgentNode, AgentStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
  const timestamp = new Date().toISOString();
  const searchParams = req.nextUrl.searchParams;
  const statusFilter = searchParams.get("status") as AgentStatus | null;

  const defaultStatuses: AgentStatus[] = ["active", "completed", "active", "idle", "active", "warning"];

  const agents: AgentNode[] = AGENT_ROLES.map((role, i) => ({
    id: role,
    role,
    name: ROLE_CONFIG[role].name,
    subtitle: ROLE_CONFIG[role].subtitle,
    status: defaultStatuses[i % defaultStatuses.length],
    efficiency: [92, 100, 87, 78, 85, 63][i],
    tasksCompleted: [34, 28, 52, 19, 11, 41][i],
    tasksTotal: [40, 28, 60, 25, 14, 50][i],
    lastActive: ["0s", "2m", "0s", "12m", "0s", "5m"][i],
    avatar: ROLE_CONFIG[role].avatar,
    accentColor: ROLE_CONFIG[role].accentColor,
    description: ROLE_CONFIG[role].description,
  }));

  const filteredAgents = statusFilter
    ? agents.filter((a) => a.status === statusFilter)
    : agents;

  const executionStates: AgentExecutionState[] = agents.map((a) => ({
    agentId: a.role,
    status: a.status,
    efficiencyPercent: a.efficiency,
    activeThreads: a.status === "active" ? 1 : 0,
    memoryUsageMb: Math.round(a.efficiency * 1.4),
    lastHeartbeat: timestamp,
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
