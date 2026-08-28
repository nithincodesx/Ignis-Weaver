import { AgentRole, AgentStatus, AgentNode, ActivityLogEntry, WorkflowStep, Workflow } from "./types";
import { PrimaryProvider, VectorDbType } from "./settingsTypes";

// ── Standard API Response & Error Contracts ─────────────────────────────────

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
  timestamp: string;
}

// ── Domain Models ────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  prompt: string;
  targetAgent: AgentRole;
  mode: "autonomous" | "hitl" | "dry-run";
  createdAt: string;
  status: "queued" | "running" | "completed" | "failed";
  attachment?: string;
}

export interface TaskExecution {
  taskId: string;
  prompt: string;
  agentRole: AgentRole;
  agentName: string;
  mode: "autonomous" | "hitl" | "dry-run";
  status: "queued" | "executing" | "completed" | "failed";
  dispatchedAt: string;
  completedAt?: string;
  estimatedDurationMs?: number;
  outputSummary?: string;
  executionLogs: string[];
}

export interface WorkflowExecution {
  workflowId: string;
  name: string;
  steps: WorkflowStep[];
  progressPercent: number;
  status: "pending" | "running" | "paused" | "completed" | "failed";
  startedAt: string;
  updatedAt: string;
}

export interface AgentExecutionState {
  agentId: AgentRole;
  status: AgentStatus;
  currentTaskId?: string;
  efficiencyPercent: number;
  activeThreads: number;
  memoryUsageMb: number;
  lastHeartbeat: string;
}

export interface ProviderConfigContract {
  provider: PrimaryProvider;
  model: string;
  baseUrl?: string;
  isConfigured: boolean;
}

// ── Endpoint 1: POST /api/agent/dispatch ───────────────────────────────────

export interface AgentDispatchPayload {
  prompt: string;
  agent: AgentRole;
  mode: "autonomous" | "hitl" | "dry-run";
  attachment?: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export type AgentDispatchResponse = ApiResponse<TaskExecution>;

// ── Endpoint 2: GET /api/agents/status ─────────────────────────────────────

export interface AgentStatusOverview {
  agents: AgentNode[];
  executionStates: AgentExecutionState[];
  summary: {
    totalAgents: number;
    activeCount: number;
    idleCount: number;
    completedCount: number;
    warningCount: number;
    errorCount: number;
  };
}

export type AgentStatusResponse = ApiResponse<AgentStatusOverview>;

// ── Endpoint 3: GET /api/metrics ───────────────────────────────────────────

export interface SystemProcessMetrics {
  processUptimeSeconds: number;
  systemUptimeSeconds: number;
  processMemoryRssMb: number;
  heapUsedMb: number;
  totalSystemMemoryMb: number;
  freeSystemMemoryMb: number;
  cpuCount: number;
  cpuModel: string;
  cpuUsagePercent: number | null;
  taskQueueSize: number;
}

export interface PlatformMetricsData {
  tasksCompletedToday: number;
  avgResponseLatencySec: number | null;
  tokenUsageDisplay: string | null;
  errorRatePercent: number | null;
  system: SystemProcessMetrics;
  agentEfficiency: Array<{ name: string; val: number; color: string }>;
}

export type PlatformMetricsResponse = ApiResponse<PlatformMetricsData>;


// ── Endpoint 4: POST /api/settings/verify-key ──────────────────────────────

export type VerifyProviderType = PrimaryProvider | "github" | "slack" | "vector-db";

export interface VerifyKeyPayload {
  provider: VerifyProviderType;
  keyOrToken?: string;
  baseUrl?: string;
}

export interface KeyVerificationResult {
  provider: VerifyProviderType;
  valid: boolean;
  message: string;
  configuredAt: string;
  latencyMs?: number;
}

export type KeyVerificationResponse = ApiResponse<KeyVerificationResult>;

// ── Real-Time Agent Execution Event Contracts ─────────────────────────────

export type AgentEventType =
  | "task_received"
  | "agent_selected"
  | "provider_started"
  | "provider_completed"
  | "workflow_step_started"
  | "workflow_step_completed"
  | "task_completed"
  | "task_failed";

export interface AgentExecutionEvent {
  eventId: string;
  type: AgentEventType;
  taskId: string;
  agentId: AgentRole;
  agentName: string;
  message: string;
  timestamp: string;
  metadata?: string;
}

