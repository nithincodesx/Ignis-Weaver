"use client";

import { cn } from "@/lib/utils";
import { AgentStatus } from "@/lib/types";

interface StatusPillProps {
  status: AgentStatus;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<AgentStatus, { label: string; cls: string; dot: string }> = {
  active:    { label: "Active",    cls: "g-badge-active",    dot: "bg-green-500" },
  idle:      { label: "Idle",      cls: "g-badge-idle",      dot: "bg-blue-500" },
  warning:   { label: "Warning",   cls: "g-badge-warning",   dot: "bg-amber-400" },
  error:     { label: "Error",     cls: "g-badge-error",     dot: "bg-red-500" },
  completed: { label: "Completed", cls: "g-badge-completed", dot: "bg-indigo-500" },
};

export default function StatusPill({ status, className, size = "md" }: StatusPillProps) {
  const cfg = statusConfig[status];
  const isActive = status === "active";
  return (
    <span
      role="status"
      aria-label={`Status: ${cfg.label}`}
      className={cn("g-badge", cfg.cls, size === "sm" && "text-[9px] px-1.5 py-0.5", className)}
    >
      <span className="relative flex h-[5px] w-[5px]">
        {isActive && <span className={cn("absolute inset-0 rounded-full opacity-60 g-pulse", cfg.dot)} />}
        <span className={cn("relative inline-flex h-[5px] w-[5px] rounded-full", cfg.dot)} />
      </span>
      {cfg.label}
    </span>
  );
}
