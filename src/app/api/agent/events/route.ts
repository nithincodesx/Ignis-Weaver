import { NextRequest } from "next/server";
import { AgentExecutionEvent, AgentEventType } from "@/lib/apiContracts";
import { AGENT_ROLES, ROLE_CONFIG, AgentRole } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const taskId = searchParams.get("taskId") || `task-stream-${Date.now()}`;
  const targetRole = (searchParams.get("agentId") || "orchestrator") as AgentRole;
  const agentRole = AGENT_ROLES.includes(targetRole) ? targetRole : "orchestrator";
  const agentInfo = ROLE_CONFIG[agentRole];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: AgentEventType, message: string, metadata?: string) => {
        const event: AgentExecutionEvent = {
          eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type,
          taskId,
          agentId: agentRole,
          agentName: agentInfo.name,
          message,
          timestamp: new Date().toISOString(),
          metadata,
        };

        const frame = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(frame));
      };

      try {
        // Event 1: task_received
        sendEvent("task_received", `Directive received for task sequence [${taskId.substring(0, 14)}]`);
        await new Promise((r) => setTimeout(r, 400));

        // Event 2: agent_selected
        sendEvent("agent_selected", `Assigned node ${agentInfo.name} (${agentInfo.subtitle})`, `Role: ${agentRole.toUpperCase()}`);
        await new Promise((r) => setTimeout(r, 500));

        // Event 3: provider_started
        sendEvent("provider_started", `Inference pipeline active on node ${agentInfo.name}`, "Provider: ACTIVE");
        await new Promise((r) => setTimeout(r, 600));

        // Event 4: provider_completed
        sendEvent("provider_completed", `Provider response generated for node ${agentInfo.name}`, "Status: 200 OK");
        await new Promise((r) => setTimeout(r, 400));

        // Event 5: task_completed
        sendEvent("task_completed", `Task execution completed successfully for ${agentInfo.name}`, `TaskID: ${taskId}`);
      } catch (err) {
        sendEvent("task_failed", err instanceof Error ? err.message : "Execution error occurred");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
