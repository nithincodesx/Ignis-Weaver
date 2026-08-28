import { AgentRole, ROLE_CONFIG } from "./types";
import {
  updateAgentStatusOnDispatchStart,
  updateAgentStatusOnDispatchSuccess,
  updateAgentStatusOnDispatchFailure,
} from "./agentRegistry";

export type WorkflowStepExecutionStatus = "pending" | "running" | "completed" | "failed" | "paused";
export type WorkflowEngineStatus = "idle" | "running" | "paused" | "completed" | "failed";

export interface WorkflowEngineStep {
  id: string;
  label: string;
  agentId: AgentRole;
  prompt: string;
  dependencies: string[];
  status: WorkflowStepExecutionStatus;
  output: string | null;
  error: string | null;
  duration?: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface WorkflowEngineRecord {
  id: string;
  name: string;
  status: WorkflowEngineStatus;
  progressPercent: number;
  steps: WorkflowEngineStep[];
  startedAt: string | null;
  updatedAt: string | null;
}

// In-memory workflow store
const workflowStore: Record<string, WorkflowEngineRecord> = {
  wf1: {
    id: "wf1",
    name: "MARKET INTELLIGENCE SCAN",
    status: "idle",
    progressPercent: 0,
    startedAt: null,
    updatedAt: new Date().toISOString(),
    steps: [
      {
        id: "s1",
        label: "Data Ingestion",
        agentId: "researcher",
        prompt: "Ingest and synthesize global market telemetry across tech sectors.",
        dependencies: [],
        status: "pending",
        output: null,
        error: null,
      },
      {
        id: "s2",
        label: "Pattern Analysis",
        agentId: "analyst",
        prompt: "Analyze financial trends and growth metrics based on ingested telemetry data.",
        dependencies: ["s1"],
        status: "pending",
        output: null,
        error: null,
      },
      {
        id: "s3",
        label: "Executive Report",
        agentId: "researcher",
        prompt: "Generate executive summary report combining pattern findings.",
        dependencies: ["s2"],
        status: "pending",
        output: null,
        error: null,
      },
      {
        id: "s4",
        label: "Visual Summary",
        agentId: "designer",
        prompt: "Create brutalist dashboard visual layout specs for executive report.",
        dependencies: ["s3"],
        status: "pending",
        output: null,
        error: null,
      },
      {
        id: "s5",
        label: "QA Assertion Check",
        agentId: "qa-engineer",
        prompt: "Perform security and schema validation check on generated report assets.",
        dependencies: ["s4"],
        status: "pending",
        output: null,
        error: null,
      },
    ],
  },
  wf2: {
    id: "wf2",
    name: "FEATURE DEPLOYMENT PIPELINE",
    status: "idle",
    progressPercent: 0,
    startedAt: null,
    updatedAt: new Date().toISOString(),
    steps: [
      {
        id: "s6",
        label: "Code Generation",
        agentId: "developer",
        prompt: "Generate TypeScript backend module for JWT user auth.",
        dependencies: [],
        status: "pending",
        output: null,
        error: null,
      },
      {
        id: "s7",
        label: "Test Suite",
        agentId: "qa-engineer",
        prompt: "Run unit test suite against generated auth module.",
        dependencies: ["s6"],
        status: "pending",
        output: null,
        error: null,
      },
      {
        id: "s8",
        label: "Security Audit",
        agentId: "qa-engineer",
        prompt: "Perform static code analysis & memory leak vulnerability scan.",
        dependencies: ["s7"],
        status: "pending",
        output: null,
        error: null,
      },
      {
        id: "s9",
        label: "Deploy Staging",
        agentId: "developer",
        prompt: "Deploy validated artifact to staging cluster environment.",
        dependencies: ["s8"],
        status: "pending",
        output: null,
        error: null,
      },
    ],
  },
};

function calculateProgress(steps: WorkflowEngineStep[]): number {
  if (steps.length === 0) return 0;
  const completed = steps.filter((s) => s.status === "completed").length;
  return Math.round((completed / steps.length) * 100);
}

export function getAllWorkflows(): WorkflowEngineRecord[] {
  return Object.values(workflowStore);
}

export function getWorkflow(id: string): WorkflowEngineRecord | undefined {
  return workflowStore[id];
}

// ── PLAY Action Handler ──────────────────────────────────────────────────────
export async function playWorkflow(workflowId: string): Promise<WorkflowEngineRecord> {
  const wf = workflowStore[workflowId];
  if (!wf) throw new Error(`Workflow '${workflowId}' not found.`);

  wf.status = "running";
  wf.updatedAt = new Date().toISOString();
  if (!wf.startedAt) wf.startedAt = new Date().toISOString();

  // Find all ready steps whose dependencies are completed
  const readySteps = wf.steps.filter((step) => {
    if (step.status !== "pending") return false;
    const depsMet = step.dependencies.every((depId) => {
      const depStep = wf.steps.find((s) => s.id === depId);
      return depStep && depStep.status === "completed";
    });
    return depsMet;
  });

  if (readySteps.length === 0) {
    const hasFailed = wf.steps.some((s) => s.status === "failed");
    const allDone = wf.steps.every((s) => s.status === "completed");
    if (allDone) wf.status = "completed";
    else if (hasFailed) wf.status = "failed";
    else wf.status = "paused";
    return wf;
  }

  // Execute ready steps (passing parent outputs)
  for (const step of readySteps) {
    step.status = "running";
    step.startedAt = new Date().toISOString();
    updateAgentStatusOnDispatchStart(step.agentId, step.id);

    // Collect parent outputs
    const parentOutputs = step.dependencies
      .map((depId) => {
        const parent = wf.steps.find((s) => s.id === depId);
        return parent && parent.output ? `[Input from ${parent.label}]: ${parent.output}` : null;
      })
      .filter(Boolean)
      .join("\n");

    const agentInfo = ROLE_CONFIG[step.agentId];
    const fullContext = parentOutputs ? `${parentOutputs}\n\n[Step Directive]: ${step.prompt}` : step.prompt;

    // Simulate step execution logic (instant or deterministic response)
    const startTime = Date.now();
    step.output = `[${agentInfo.name}] Executed step "${step.label}". Context verified. Output generated successfully.`;
    step.duration = `${((Date.now() - startTime + 350) / 1000).toFixed(1)}s`;
    step.status = "completed";
    step.completedAt = new Date().toISOString();

    updateAgentStatusOnDispatchSuccess(step.agentId);
  }

  wf.progressPercent = calculateProgress(wf.steps);
  const allDoneNow = wf.steps.every((s) => s.status === "completed");
  if (allDoneNow) wf.status = "completed";

  return wf;
}

// ── PAUSE Action Handler ─────────────────────────────────────────────────────
export function pauseWorkflow(workflowId: string): WorkflowEngineRecord {
  const wf = workflowStore[workflowId];
  if (!wf) throw new Error(`Workflow '${workflowId}' not found.`);

  wf.status = "paused";
  wf.updatedAt = new Date().toISOString();

  wf.steps.forEach((step) => {
    if (step.status === "running") {
      step.status = "paused";
    }
  });

  return wf;
}

// ── RETRY Action Handler ────────────────────────────────────────────────────
export async function retryWorkflowStep(workflowId: string, stepId?: string): Promise<WorkflowEngineRecord> {
  const wf = workflowStore[workflowId];
  if (!wf) throw new Error(`Workflow '${workflowId}' not found.`);

  const targetStep = stepId
    ? wf.steps.find((s) => s.id === stepId)
    : wf.steps.find((s) => s.status === "failed");

  if (!targetStep) {
    throw new Error(`No failed step found in workflow '${workflowId}'.`);
  }

  // Reset target step state
  targetStep.status = "pending";
  targetStep.error = null;
  targetStep.output = null;
  targetStep.completedAt = null;

  // Re-run workflow from target step
  return playWorkflow(workflowId);
}

// Helper to manually set a step as failed for testing purposes
export function failWorkflowStepForTest(workflowId: string, stepId: string, errorMsg: string): WorkflowEngineRecord {
  const wf = workflowStore[workflowId];
  if (!wf) throw new Error(`Workflow '${workflowId}' not found.`);
  const step = wf.steps.find((s) => s.id === stepId);
  if (step) {
    step.status = "failed";
    step.error = errorMsg;
    updateAgentStatusOnDispatchFailure(step.agentId);
  }
  wf.status = "failed";
  wf.progressPercent = calculateProgress(wf.steps);
  return wf;
}
