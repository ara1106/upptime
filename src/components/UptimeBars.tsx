"use client";

import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import type { DailyUptime } from "@/lib/api";

interface UptimeBarsProps {
  dailyUptime: DailyUptime[];
  className?: string;
}

export function UptimeBars({ dailyUptime, className }: UptimeBarsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getBarColor = (uptime: number | null) => {
    if (uptime === null) return "bg-border";
    if (uptime >= 99.9) return "bg-status-up";
    if (uptime >= 95) return "bg-status-degraded";
    return "bg-status-down";
  };

  const getBarGlow = (uptime: number | null) => {
    if (uptime === null) return "";
    if (uptime >= 99.9) return "status-dot-up";
    if (uptime >= 95) return "status-dot-degraded";
    return "status-dot-down";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-[2px] h-8 items-stretch">
        {dailyUptime.map((day, index) => (
          <div
            key={index}
            className="relative flex-1 min-w-[3px]"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={cn(
                "h-full rounded-sm cursor-pointer transition-transform",
                getBarColor(day.uptime),
                hoveredIndex === index && "scale-y-110",
                hoveredIndex === index && getBarGlow(day.uptime)
              )}
            />
            {hoveredIndex === index && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10">
                <div className="bg-card border border-border rounded-md px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                  <div className="font-medium">{formatDate(day.date)}</div>
                  <div className="text-muted">
                    {day.uptime !== null
                      ? `${day.uptime.toFixed(2)}% uptime`
                      : "No data"}
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{dailyUptime.length} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export function UptimeBarsSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex gap-[2px] h-8">
        {Array.from({ length: 90 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-[3px] bg-border rounded-sm animate-pulse"
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
