import { AgentRole, AgentStatus, AgentNode, ROLE_CONFIG, AGENT_ROLES } from "./types";

export interface AgentRecord {
  agentId: AgentRole;
  name: string;
  subtitle: string;
  status: AgentStatus;
  currentTaskId: string | null;
  lastHeartbeat: string | null;
  startedAt: string | null;
  completedTasks: number;
  failureCount: number;
}

// In-memory server-side state registry
const agentRegistryStore: Record<AgentRole, AgentRecord> = {
  orchestrator: { agentId: "orchestrator", name: "PAUL", subtitle: "ORCHESTRATOR", status: "idle", currentTaskId: null, lastHeartbeat: null, startedAt: null, completedTasks: 0, failureCount: 0 },
  researcher:   { agentId: "researcher",   name: "MARCO", subtitle: "USER RESEARCHER", status: "idle", currentTaskId: null, lastHeartbeat: null, startedAt: null, completedTasks: 0, failureCount: 0 },
  developer:    { agentId: "developer",    name: "VIKTOR", subtitle: "BACKEND ENGINEER", status: "idle", currentTaskId: null, lastHeartbeat: null, startedAt: null, completedTasks: 0, failureCount: 0 },
  analyst:      { agentId: "analyst",      name: "ALEXIS", subtitle: "PRODUCT ANALYST", status: "idle", currentTaskId: null, lastHeartbeat: null, startedAt: null, completedTasks: 0, failureCount: 0 },
  designer:     { agentId: "designer",     name: "SARAH", subtitle: "UX DESIGNER", status: "idle", currentTaskId: null, lastHeartbeat: null, startedAt: null, completedTasks: 0, failureCount: 0 },
  "qa-engineer":{ agentId: "qa-engineer",  name: "ELENA", subtitle: "QA AUDITOR", status: "idle", currentTaskId: null, lastHeartbeat: null, startedAt: null, completedTasks: 0, failureCount: 0 },
};

export function getAgentRegistry(): AgentRecord[] {
  return AGENT_ROLES.map((r) => agentRegistryStore[r]);
}

export function getAgentRecord(role: AgentRole): AgentRecord | undefined {
  return agentRegistryStore[role];
}

export function updateAgentStatusOnDispatchStart(agentId: AgentRole, taskId: string): void {
  const record = agentRegistryStore[agentId];
  if (record) {
    record.status = "active";
    record.currentTaskId = taskId;
    record.lastHeartbeat = new Date().toISOString();
    if (!record.startedAt) record.startedAt = new Date().toISOString();
  }
}

export function updateAgentStatusOnDispatchSuccess(agentId: AgentRole): void {
  const record = agentRegistryStore[agentId];
  if (record) {
    record.status = "idle";
    record.currentTaskId = null;
    record.lastHeartbeat = new Date().toISOString();
    record.completedTasks += 1;
  }
}

export function updateAgentStatusOnDispatchFailure(agentId: AgentRole): void {
  const record = agentRegistryStore[agentId];
  if (record) {
    record.status = "error";
    record.currentTaskId = null;
    record.lastHeartbeat = new Date().toISOString();
    record.failureCount += 1;
  }
}

export function formatLastActive(isoString: string | null): string {
  if (!isoString) return "N/A";
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h`;
  } catch {
    return "N/A";
  }
}
