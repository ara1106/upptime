"use client";

import { cn, formatResponseTime } from "@/lib/utils";
import { calculateDailyUptime, type ServiceStatus } from "@/lib/api";
import { UptimeBars, UptimeBarsSkeleton } from "./UptimeBars";

interface ServiceCardProps {
  service: ServiceStatus;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const dailyUptime = calculateDailyUptime(service.dailyMinutesDown, 90);

  const statusConfig = {
    up: {
      label: "Operational",
      dot: "bg-status-up status-dot-up animate-pulse-slow",
      text: "text-status-up",
    },
    degraded: {
      label: "Degraded",
      dot: "bg-status-degraded status-dot-degraded",
      text: "text-status-degraded",
    },
    down: {
      label: "Down",
      dot: "bg-status-down status-dot-down",
      text: "text-status-down",
    },
  };

  const config = statusConfig[service.status] || statusConfig.down;

  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:bg-card-hover hover:border-border-light transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", config.dot)} />
          <h3 className="font-semibold truncate">{service.name}</h3>
        </div>
        <span className={cn("text-sm font-medium shrink-0", config.text)}>
          {config.label}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-muted">
        <span>{formatResponseTime(service.time)} avg</span>
        <span className="text-foreground font-medium">
          {service.uptimeMonth}
        </span>
      </div>

      {/* Uptime bars */}
      <UptimeBars dailyUptime={dailyUptime} />
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-muted" />
          <div className="h-5 w-32 rounded bg-muted" />
        </div>
        <div className="h-5 w-20 rounded bg-muted" />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
      </div>

      {/* Uptime bars */}
      <UptimeBarsSkeleton />
    </div>
  );
}
