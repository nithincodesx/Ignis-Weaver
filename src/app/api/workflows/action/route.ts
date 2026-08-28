import { NextRequest, NextResponse } from "next/server";
import {
  playWorkflow,
  pauseWorkflow,
  retryWorkflowStep,
  failWorkflowStepForTest,
  WorkflowEngineRecord,
} from "@/lib/workflowEngine";
import { ApiResponse } from "@/lib/apiContracts";

export interface WorkflowActionPayload {
  workflowId: string;
  action: "play" | "pause" | "retry" | "test_fail";
  stepId?: string;
}

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    const body = (await req.json()) as Partial<WorkflowActionPayload>;

    if (!body.workflowId || typeof body.workflowId !== "string") {
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: {
          code: "INVALID_WORKFLOW_ID",
          message: "workflowId is required.",
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!body.action || !["play", "pause", "retry", "test_fail"].includes(body.action)) {
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: {
          code: "INVALID_ACTION",
          message: "action must be 'play', 'pause', 'retry', or 'test_fail'.",
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    let updatedWorkflow: WorkflowEngineRecord;

    if (body.action === "play") {
      updatedWorkflow = await playWorkflow(body.workflowId);
    } else if (body.action === "pause") {
      updatedWorkflow = pauseWorkflow(body.workflowId);
    } else if (body.action === "retry") {
      updatedWorkflow = await retryWorkflowStep(body.workflowId, body.stepId);
    } else {
      updatedWorkflow = failWorkflowStepForTest(
        body.workflowId,
        body.stepId || "s1",
        "Dependency assertion failure."
      );
    }

    const response: ApiResponse<WorkflowEngineRecord> = {
      success: true,
      data: updatedWorkflow,
      timestamp,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const errorResponse: ApiResponse<never> = {
      success: false,
      error: {
        code: "WORKFLOW_ACTION_FAILED",
        message: err instanceof Error ? err.message : "Workflow action execution failed.",
      },
      timestamp,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
