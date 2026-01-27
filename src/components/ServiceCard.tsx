"use client";

import { useState } from "react";
import { cn, formatResponseTime } from "@/lib/utils";
import { calculateDailyUptime, type ServiceStatus } from "@/lib/api";
import { UptimeBars, UptimeBarsSkeleton } from "./UptimeBars";

interface ServiceCardProps {
  service: ServiceStatus;
}

// Default icon when no favicon available
function DefaultServiceIcon({ name }: { name: string }) {
  // Choose icon based on service name
  const iconPath = name.toLowerCase().includes("jellyfin")
    ? "M19.5 7.5l-1.5 1.5-4-4-4 4-1.5-1.5 5.5-5.5 5.5 5.5zM4.5 16.5l1.5-1.5 4 4 4-4 1.5 1.5-5.5 5.5-5.5-5.5z" // Media icon
    : name.toLowerCase().includes("auth")
    ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" // Lock icon
    : name.toLowerCase().includes("request") || name.toLowerCase().includes("seerr")
    ? "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" // Film icon
    : "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"; // Globe icon

  return (
    <svg
      className="w-full h-full text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
    </svg>
  );
}

function ServiceIcon({ icon, name }: { icon?: string; name: string }) {
  const [error, setError] = useState(false);

  if (!icon || error) {
    return <DefaultServiceIcon name={name} />;
  }

  return (
    <img
      src={icon}
      alt=""
      className="w-full h-full rounded object-contain"
      onError={() => setError(true)}
    />
  );
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
    <article className="rounded-xl border border-border bg-card p-5 sm:p-6 hover:bg-card-hover hover:border-border-light transition-colors overflow-hidden">
      {/* Header row: Icon + Name + Status */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-background/50 p-1.5">
            <ServiceIcon icon={service.icon} name={service.name} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base truncate">{service.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn("h-2 w-2 rounded-full shrink-0", config.dot)} />
              <span className={cn("text-xs font-medium", config.text)}>
                {config.label}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-bold text-foreground">
            {service.uptimeMonth}
          </div>
          <div className="text-[11px] sm:text-xs text-muted">
            {formatResponseTime(service.time)} avg
          </div>
        </div>
      </div>

      {/* Uptime bars */}
      <div className="pt-3 border-t border-border/50">
        <UptimeBars dailyUptime={dailyUptime} />
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <article className="rounded-xl border border-border bg-card p-5 sm:p-6 animate-pulse overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted/50 shrink-0" />
          <div>
            <div className="h-5 w-28 rounded bg-muted/50 mb-1.5" />
            <div className="h-3 w-20 rounded bg-muted/50" />
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 w-16 rounded bg-muted/50 mb-1" />
          <div className="h-3 w-14 rounded bg-muted/50" />
        </div>
      </div>

      {/* Uptime bars */}
      <div className="pt-3 border-t border-border/50">
        <UptimeBarsSkeleton />
      </div>
    </article>
  );
}
