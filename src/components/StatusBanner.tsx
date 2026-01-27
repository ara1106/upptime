"use client";

import { cn, type Status, getStatusLabel, getRelativeTime } from "@/lib/utils";

interface StatusBannerProps {
  status: Status;
  lastUpdated: Date;
}

export function StatusBanner({ status, lastUpdated }: StatusBannerProps) {
  const statusConfig = {
    up: {
      bg: "bg-gradient-to-r from-status-up/20 to-status-up/10",
      border: "border-status-up/30",
      dot: "bg-status-up status-dot-up",
      text: "text-status-up",
    },
    degraded: {
      bg: "bg-gradient-to-r from-status-degraded/20 to-status-degraded/10",
      border: "border-status-degraded/30",
      dot: "bg-status-degraded status-dot-degraded",
      text: "text-status-degraded",
    },
    down: {
      bg: "bg-gradient-to-r from-status-down/20 to-status-down/10",
      border: "border-status-down/30",
      dot: "bg-status-down status-dot-down",
      text: "text-status-down",
    },
    maintenance: {
      bg: "bg-gradient-to-r from-status-maintenance/20 to-status-maintenance/10",
      border: "border-status-maintenance/30",
      dot: "bg-status-maintenance",
      text: "text-status-maintenance",
    },
    unknown: {
      bg: "bg-gradient-to-r from-muted/20 to-muted/10",
      border: "border-muted/30",
      dot: "bg-muted",
      text: "text-muted",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "rounded-lg border p-6",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "h-3 w-3 rounded-full",
            config.dot,
            status === "up" && "animate-pulse-slow"
          )}
        />
        <h2 className={cn("text-xl font-semibold", config.text)}>
          {getStatusLabel(status)}
        </h2>
      </div>
      <p className="mt-2 text-sm text-muted">
        Last checked {getRelativeTime(lastUpdated)}
      </p>
    </div>
  );
}

export function StatusBannerSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-muted" />
        <div className="h-6 w-48 rounded bg-muted" />
      </div>
      <div className="mt-2 h-4 w-32 rounded bg-muted" />
    </div>
  );
}
