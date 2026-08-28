import { NextResponse } from "next/server";
import { getAllWorkflows } from "@/lib/workflowEngine";
import { ApiResponse } from "@/lib/apiContracts";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();
  try {
    const workflows = getAllWorkflows();
    const response: ApiResponse<typeof workflows> = {
      success: true,
      data: workflows,
      timestamp,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const errorResponse: ApiResponse<never> = {
      success: false,
      error: {
        code: "WORKFLOW_FETCH_FAILED",
        message: err instanceof Error ? err.message : "Failed to fetch workflow records.",
      },
      timestamp,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
