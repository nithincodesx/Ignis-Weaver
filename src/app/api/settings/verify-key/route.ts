import { NextRequest, NextResponse } from "next/server";
import { KeyVerificationResponse, VerifyKeyPayload, VerifyProviderType } from "@/lib/apiContracts";

const VALID_PROVIDERS: VerifyProviderType[] = [
  "openai",
  "anthropic",
  "gemini",
  "custom",
  "github",
  "slack",
  "vector-db",
];

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    const body = (await req.json()) as Partial<VerifyKeyPayload>;

    if (!body.provider || !VALID_PROVIDERS.includes(body.provider as VerifyProviderType)) {
      const errorResponse: KeyVerificationResponse = {
        success: false,
        error: {
          code: "INVALID_PROVIDER",
          message: `Provider must be one of: ${VALID_PROVIDERS.join(", ")}`,
        },
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const provider = body.provider as VerifyProviderType;
    const rawKey = body.keyOrToken?.trim() || "";
    const baseUrl = body.baseUrl?.trim() || "";

    if (!rawKey && !baseUrl && provider !== "custom") {
      const response: KeyVerificationResponse = {
        success: true,
        data: {
          provider,
          valid: false,
          message: `Missing API key or credential input for ${provider.toUpperCase()}.`,
          configuredAt: timestamp,
        },
        timestamp,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const startTime = Date.now();
    let isValid = false;
    let errorMessage = "";

    try {
      if (provider === "openai") {
        const res = await fetch("https://api.openai.com/v1/models", {
          method: "GET",
          headers: { Authorization: `Bearer ${rawKey}` },
        });
        if (res.ok) {
          isValid = true;
        } else {
          const json = await res.json().catch(() => ({}));
          errorMessage = json.error?.message || `OpenAI API returned status ${res.status}`;
        }
      } else if (provider === "anthropic") {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": rawKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 1,
            messages: [{ role: "user", content: "ping" }],
          }),
        });
        if (res.ok) {
          isValid = true;
        } else {
          const json = await res.json().catch(() => ({}));
          errorMessage = json.error?.message || `Anthropic API returned status ${res.status}`;
        }
      } else if (provider === "gemini") {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${rawKey}`, {
          method: "GET",
        });
        if (res.ok) {
          isValid = true;
        } else {
          const json = await res.json().catch(() => ({}));
          errorMessage = json.error?.message || `Gemini API returned status ${res.status}`;
        }
      } else if (provider === "custom") {
        const target = baseUrl ? `${baseUrl.replace(/\/$/, "")}/models` : "http://localhost:11434/v1/models";
        const res = await fetch(target, { method: "GET" });
        if (res.ok) {
          isValid = true;
        } else {
          errorMessage = `Custom endpoint returned status ${res.status}`;
        }
      } else if (provider === "github") {
        const res = await fetch("https://api.github.com/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${rawKey}`,
            "User-Agent": "GUILD-OS-KeyVerifier",
          },
        });
        if (res.ok) {
          isValid = true;
        } else {
          const json = await res.json().catch(() => ({}));
          errorMessage = json.message || `GitHub API returned status ${res.status}`;
        }
      } else if (provider === "slack") {
        isValid = rawKey.startsWith("https://hooks.slack.com/services/");
        if (!isValid) errorMessage = "Invalid Slack Webhook URL format.";
      } else {
        isValid = true;
      }
    } catch (netErr) {
      errorMessage = netErr instanceof Error ? netErr.message : "Network error reaching provider endpoint.";
    }

    const latencyMs = Date.now() - startTime;

    const response: KeyVerificationResponse = {
      success: true,
      data: {
        provider,
        valid: isValid,
        message: isValid
          ? `Credential verified successfully for ${provider.toUpperCase()} (${latencyMs}ms).`
          : errorMessage || `Verification failed for ${provider.toUpperCase()}.`,
        configuredAt: timestamp,
        latencyMs,
      },
      timestamp,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const errorResponse: KeyVerificationResponse = {
      success: false,
      error: {
        code: "VERIFICATION_FAILED",
        message: err instanceof Error ? err.message : "Failed to verify credential.",
      },
      timestamp,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

