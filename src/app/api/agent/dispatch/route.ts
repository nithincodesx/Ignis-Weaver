import { NextRequest, NextResponse } from "next/server";
import { AgentDispatchPayload, AgentDispatchResponse } from "@/lib/apiContracts";
import { AGENT_ROLES, ROLE_CONFIG, AgentRole } from "@/lib/types";
import {
  updateAgentStatusOnDispatchStart,
  updateAgentStatusOnDispatchSuccess,
  updateAgentStatusOnDispatchFailure,
} from "@/lib/agentRegistry";

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  try {
    const body = (await req.json()) as Partial<AgentDispatchPayload & { agentId?: AgentRole }>;

    // 1. Validate prompt
    const prompt = body.prompt?.trim();
    if (!prompt || typeof prompt !== "string") {
      const errorResponse: AgentDispatchResponse = {
        success: false,
        error: {
          code: "INVALID_PROMPT",
          message: "Prompt string is required and cannot be empty.",
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 2. Validate agent ID
    const agentRole = (body.agentId || body.agent) as AgentRole;
    if (!agentRole || !AGENT_ROLES.includes(agentRole)) {
      const errorResponse: AgentDispatchResponse = {
        success: false,
        error: {
          code: "INVALID_AGENT",
          message: `Target agentId must be one of: ${AGENT_ROLES.join(", ")}`,
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 3. Validate execution mode
    const mode = body.mode || "autonomous";
    if (!["autonomous", "hitl", "dry-run"].includes(mode)) {
      const errorResponse: AgentDispatchResponse = {
        success: false,
        error: {
          code: "INVALID_MODE",
          message: "Execution mode must be 'autonomous', 'hitl', or 'dry-run'.",
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const agentInfo = ROLE_CONFIG[agentRole];

    // Transition agent status to ACTIVE in server registry
    updateAgentStatusOnDispatchStart(agentRole, taskId);

    // 4. Resolve provider and secret credentials (ONLY server-side from process.env or securely passed headers)
    const primaryProvider = (
      req.headers.get("x-primary-provider") ||
      process.env.PRIMARY_PROVIDER ||
      "openai"
    ).toLowerCase();

    const openaiKey = (req.headers.get("x-openai-key") ?? process.env.OPENAI_API_KEY ?? "").trim();
    const anthropicKey = (req.headers.get("x-anthropic-key") ?? process.env.ANTHROPIC_API_KEY ?? "").trim();
    const geminiKey = (req.headers.get("x-gemini-key") ?? process.env.GEMINI_API_KEY ?? "").trim();
    const customUrl = (req.headers.get("x-custom-url") ?? process.env.CUSTOM_LLM_BASE_URL ?? "http://localhost:11434/v1").trim();
    const customKey = (req.headers.get("x-custom-key") ?? process.env.CUSTOM_LLM_API_KEY ?? "").trim();

    let selectedProvider = primaryProvider;
    let apiKey = "";

    if (selectedProvider === "openai") apiKey = openaiKey;
    else if (selectedProvider === "anthropic") apiKey = anthropicKey;
    else if (selectedProvider === "gemini") apiKey = geminiKey;
    else if (selectedProvider === "custom") apiKey = customKey;

    // Handle Dry-Run Mode
    if (mode === "dry-run") {
      updateAgentStatusOnDispatchSuccess(agentRole);
      const response: AgentDispatchResponse = {
        success: true,
        data: {
          taskId: `task-dryrun-${Date.now()}`,
          prompt,
          agentRole,
          agentName: agentInfo.name,
          mode: "dry-run",
          status: "completed",
          dispatchedAt: timestamp,
          completedAt: new Date().toISOString(),
          outputSummary: `[DRY-RUN SIMULATION VALIDATED] Agent ${agentInfo.name} (${agentInfo.subtitle}) verified prompt routing to provider '${selectedProvider}'.`,
          executionLogs: [
            `[${timestamp}] Dry-run simulation initiated.`,
            `[${timestamp}] Target agent: ${agentInfo.name} (${agentRole}).`,
            `[${timestamp}] Provider path: ${selectedProvider}. Execution parameters validated without sending live LLM inference request.`,
          ],
        },
        timestamp,
      };
      return NextResponse.json(response, { status: 200 });
    }

    // 5. Check if provider credentials exist
    if (!apiKey && selectedProvider !== "custom") {
      updateAgentStatusOnDispatchFailure(agentRole);
      const errorResponse: AgentDispatchResponse = {
        success: false,
        error: {
          code: "NO_PROVIDER_CONFIGURED",
          message: `No API key configured for provider '${selectedProvider}'. Please configure API keys in Settings or set environment variables (OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY).`,
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 6. Execute REAL HTTP provider request using native fetch()
    let llmOutputText = "";

    try {
      const systemPrompt = `You are ${agentInfo.name}, a specialized AI agent acting as ${agentInfo.subtitle} in the GUILD Enterprise OS network. ${agentInfo.description} Respond concisely to the directive.`;

      if (selectedProvider === "openai") {
        const modelName = req.headers.get("x-openai-model") || process.env.OPENAI_MODEL || "gpt-4o-mini";
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(`OpenAI API error (${res.status}): ${json.error?.message || res.statusText}`);
        }
        llmOutputText = json.choices?.[0]?.message?.content || "No output returned from OpenAI.";
      } else if (selectedProvider === "anthropic") {
        const modelName = req.headers.get("x-anthropic-model") || process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: modelName,
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(`Anthropic API error (${res.status}): ${json.error?.message || res.statusText}`);
        }
        llmOutputText = json.content?.[0]?.text || "No output returned from Anthropic.";
      } else if (selectedProvider === "gemini") {
        const modelName = req.headers.get("x-gemini-model") || process.env.GEMINI_MODEL || "gemini-1.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nUser Directive: ${prompt}` }],
              },
            ],
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(`Gemini API error (${res.status}): ${json.error?.message || res.statusText}`);
        }
        llmOutputText = json.candidates?.[0]?.content?.parts?.[0]?.text || "No output returned from Gemini.";
      } else if (selectedProvider === "custom") {
        const modelName = req.headers.get("x-custom-model") || process.env.CUSTOM_LLM_MODEL || "llama3:latest";
        const targetEndpoint = `${customUrl.replace(/\/$/, "")}/chat/completions`;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

        const res = await fetch(targetEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(`Custom LLM endpoint error (${res.status}): ${json.error?.message || res.statusText}`);
        }
        llmOutputText = json.choices?.[0]?.message?.content || "No output returned from custom endpoint.";
      }
    } catch (execErr) {
      updateAgentStatusOnDispatchFailure(agentRole);
      const errorResponse: AgentDispatchResponse = {
        success: false,
        error: {
          code: "PROVIDER_EXECUTION_FAILED",
          message: execErr instanceof Error ? execErr.message : "Provider execution failed.",
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 502 });
    }

    updateAgentStatusOnDispatchSuccess(agentRole);
    const completedAt = new Date().toISOString();
    const response: AgentDispatchResponse = {
      success: true,
      data: {
        taskId,
        prompt,
        agentRole,
        agentName: agentInfo.name,
        mode,
        status: "completed",
        dispatchedAt: timestamp,
        completedAt,
        outputSummary: llmOutputText,
        executionLogs: [
          `[${timestamp}] Directive dispatched to ${agentInfo.name} (${agentRole}).`,
          `[${timestamp}] Routed to provider '${selectedProvider}'.`,
          `[${completedAt}] LLM response successfully generated and returned.`,
        ],
      },
      timestamp,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const errorResponse: AgentDispatchResponse = {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: err instanceof Error ? err.message : "Failed to process task dispatch request.",
      },
      timestamp,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

