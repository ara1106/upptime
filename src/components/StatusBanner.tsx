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
        "rounded-xl border-2 overflow-hidden",
        config.bg,
        config.border
      )}
      style={{ padding: "1.25rem" }}
    >
      <div className="flex items-center" style={{ gap: "0.75rem" }}>
        <span
          className={cn(
            "rounded-full shrink-0",
            config.dot,
            status === "up" && "animate-pulse-slow"
          )}
          style={{ width: "0.75rem", height: "0.75rem" }}
        />
        <h2 className={cn("text-xl font-semibold", config.text)}>
          {getStatusLabel(status)}
        </h2>
      </div>
      <p className="text-sm text-muted" style={{ marginTop: "0.5rem" }}>
        Last checked {getRelativeTime(lastUpdated)}
      </p>
    </div>
  );
}

export function StatusBannerSkeleton() {
  return (
    <div
      className="rounded-xl border-2 border-border bg-card animate-pulse"
      style={{ padding: "1.25rem" }}
    >
      <div className="flex items-center" style={{ gap: "0.75rem" }}>
        <div className="rounded-full bg-muted" style={{ width: "0.75rem", height: "0.75rem" }} />
        <div className="rounded bg-muted" style={{ height: "1.5rem", width: "12rem" }} />
      </div>
      <div className="rounded bg-muted" style={{ marginTop: "0.5rem", height: "1rem", width: "8rem" }} />
    </div>
  );
}
