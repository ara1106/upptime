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
    <article
      className="rounded-xl border-2 border-border bg-card hover:bg-card-hover hover:border-border-light transition-colors overflow-hidden"
      style={{ padding: "1.25rem" }}
    >
      {/* Header row: Icon + Name + Status */}
      <div className="flex items-center justify-between mb-4" style={{ gap: "0.75rem" }}>
        <div className="flex items-center min-w-0" style={{ gap: "0.75rem" }}>
          <div
            className="shrink-0 flex items-center justify-center rounded-lg bg-background/50"
            style={{ width: "2.5rem", height: "2.5rem", padding: "0.375rem" }}
          >
            <ServiceIcon icon={service.icon} name={service.name} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-base truncate">{service.name}</h3>
            <div className="flex items-center mt-1" style={{ gap: "0.375rem" }}>
              <span className={cn("h-2 w-2 rounded-full shrink-0", config.dot)} />
              <span className={cn("text-xs font-medium", config.text)}>
                {config.label}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-bold text-foreground">
            {service.uptimeMonth}
          </div>
          <div className="text-xs text-muted">
            {formatResponseTime(service.time)} avg
          </div>
        </div>
      </div>

      {/* Uptime bars */}
      <div className="border-t border-border/50" style={{ paddingTop: "0.75rem" }}>
        <UptimeBars dailyUptime={dailyUptime} />
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <article
      className="rounded-xl border-2 border-border bg-card animate-pulse overflow-hidden"
      style={{ padding: "1.25rem" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ gap: "0.75rem" }}>
        <div className="flex items-center" style={{ gap: "0.75rem" }}>
          <div
            className="rounded-lg bg-muted/50 shrink-0"
            style={{ width: "2.5rem", height: "2.5rem" }}
          />
          <div>
            <div className="rounded bg-muted/50 mb-1.5" style={{ height: "1.25rem", width: "7rem" }} />
            <div className="rounded bg-muted/50" style={{ height: "0.75rem", width: "5rem" }} />
          </div>
        </div>
        <div className="text-right">
          <div className="rounded bg-muted/50 mb-1" style={{ height: "1.5rem", width: "4rem" }} />
          <div className="rounded bg-muted/50" style={{ height: "0.75rem", width: "3.5rem" }} />
        </div>
      </div>

      {/* Uptime bars */}
      <div className="border-t border-border/50" style={{ paddingTop: "0.75rem" }}>
        <UptimeBarsSkeleton />
      </div>
    </article>
  );
}
