import { NextResponse } from "next/server";
import os from "os";
import { PlatformMetricsResponse, PlatformMetricsData } from "@/lib/apiContracts";
import { getAgentRegistry } from "@/lib/agentRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const cpus = os.cpus();

    const registry = getAgentRegistry();
    const totalDone = registry.reduce((sum, r) => sum + r.completedTasks, 0);
    const totalFail = registry.reduce((sum, r) => sum + r.failureCount, 0);
    const totalAttempted = totalDone + totalFail;
    const activeTasksCount = registry.filter((r) => r.status === "active").length;

    const errorRatePercent =
      totalAttempted > 0 ? Number(((totalFail / totalAttempted) * 100).toFixed(1)) : null;

    const metricsData: PlatformMetricsData = {
      tasksCompletedToday: totalDone,
      avgResponseLatencySec: null, // Null indicates latency telemetry unmeasured
      tokenUsageDisplay: null,      // Null indicates token telemetry unmeasured
      errorRatePercent,
      system: {
        processUptimeSeconds: Math.round(process.uptime()),
        systemUptimeSeconds: Math.round(os.uptime()),
        processMemoryRssMb: Math.round(memUsage.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memUsage.heapUsed / (1024 * 1024)),
        totalSystemMemoryMb: Math.round(totalMem / (1024 * 1024)),
        freeSystemMemoryMb: Math.round(freeMem / (1024 * 1024)),
        cpuCount: cpus.length,
        cpuModel: cpus[0]?.model || "N/A",
        cpuUsagePercent: null, // Null prevents fabricating CPU % from memory
        taskQueueSize: activeTasksCount,
      },
      agentEfficiency: registry.map((r) => ({
        name: r.name,
        val: 0, // 0 indicates efficiency percentage is N/A until benchmarked
        color: "#5B8DEF",
      })),
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

