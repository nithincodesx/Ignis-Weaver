import { NextResponse } from "next/server";
import os from "os";
import { PlatformMetricsResponse, PlatformMetricsData } from "@/lib/apiContracts";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryAllocatedMb = Math.round(usedMem / (1024 * 1024));
    const memoryTotalMb = Math.round(totalMem / (1024 * 1024));
    const freeMemoryMb = Math.round(freeMem / (1024 * 1024));
    const cpuUsagePercent = Math.round((usedMem / totalMem) * 100);

    const metricsData: PlatformMetricsData = {
      tasksCompletedToday: 185,
      avgResponseLatencySec: 1.8,
      tokenUsageDisplay: "248K",
      errorRatePercent: 0.3,
      system: {
        cpuUsagePercent,
        memoryAllocatedMb,
        memoryTotalMb,
        freeMemoryMb,
        uptimeSeconds: Math.round(os.uptime()),
        taskQueueSize: 0,
        apiGatewayLatencyMs: 18,
      },
      agentEfficiency: [
        { name: "PAUL", val: 96, color: "#10D9B1" },
        { name: "MARCO", val: 92, color: "#5B8DEF" },
        { name: "VIKTOR", val: 87, color: "#8b5cf6" },
        { name: "ALEXIS", val: 78, color: "#f59e0b" },
        { name: "SARAH", val: 85, color: "#ec4899" },
        { name: "ELENA", val: 63, color: "#06b6d4" },
      ],
    };

    const response: PlatformMetricsResponse = {
      success: true,
      data: metricsData,
      timestamp,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const errorResponse: PlatformMetricsResponse = {
      success: false,
      error: {
        code: "METRICS_FETCH_FAILED",
        message: err instanceof Error ? err.message : "Failed to retrieve process metrics.",
      },
      timestamp,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
