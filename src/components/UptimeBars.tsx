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
      <div className="flex gap-[2px] h-6 sm:h-7 items-stretch">
        {dailyUptime.map((day, index) => (
          <div
            key={index}
            className="relative flex-1 min-w-0"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={cn(
                "h-full rounded-sm cursor-pointer transition-all",
                getBarColor(day.uptime),
                hoveredIndex === index && "brightness-125 scale-y-110"
              )}
            />
            {hoveredIndex === index && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                  <div className="font-medium text-foreground">{formatDate(day.date)}</div>
                  <div className="text-muted mt-0.5">
                    {day.uptime !== null
                      ? `${day.uptime.toFixed(2)}% uptime`
                      : "No data"}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] sm:text-xs text-muted px-0.5">
        <span>{dailyUptime.length} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export function UptimeBarsSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex gap-[2px] h-6 sm:h-7">
        {Array.from({ length: 90 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-0 bg-muted/30 rounded-sm animate-pulse"
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] sm:text-xs text-muted px-0.5">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
