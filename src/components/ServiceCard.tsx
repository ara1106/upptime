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
      className="h-5 w-5 sm:h-6 sm:w-6 text-muted"
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
      className="h-5 w-5 sm:h-6 sm:w-6 rounded object-contain"
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
    <article className="rounded-xl border border-border bg-card p-4 sm:p-5 hover:bg-card-hover hover:border-border-light transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="shrink-0">
            <ServiceIcon icon={service.icon} name={service.name} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full shrink-0", config.dot)} />
              <h3 className="font-semibold text-sm sm:text-base truncate">{service.name}</h3>
            </div>
          </div>
        </div>
        <span className={cn("text-xs sm:text-sm font-medium shrink-0", config.text)}>
          {config.label}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 sm:gap-4 mb-3 text-xs sm:text-sm text-muted pl-8 sm:pl-9">
        <span>{formatResponseTime(service.time)} avg</span>
        <span className="text-foreground font-medium">
          {service.uptimeMonth}
        </span>
      </div>

      {/* Uptime bars */}
      <div className="mt-1">
        <UptimeBars dailyUptime={dailyUptime} />
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <article className="rounded-xl border border-border bg-card p-4 sm:p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-muted shrink-0" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-5 w-28 rounded bg-muted" />
          </div>
        </div>
        <div className="h-5 w-20 rounded bg-muted" />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 pl-9">
        <div className="h-4 w-14 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
      </div>

      {/* Uptime bars */}
      <UptimeBarsSkeleton />
    </article>
  );
}
