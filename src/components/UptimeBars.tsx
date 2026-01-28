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
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "2px", height: "1.75rem", alignItems: "stretch" }}>
        {dailyUptime.map((day, index) => (
          <div
            key={index}
            className="relative"
            style={{ flex: 1, minWidth: 0 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={cn(
                "rounded-sm cursor-pointer transition-all",
                getBarColor(day.uptime),
                hoveredIndex === index && "brightness-125 scale-y-110"
              )}
              style={{ height: "100%" }}
            />
            {hoveredIndex === index && (
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: "0.5rem",
                  zIndex: 50,
                }}
              >
                <div
                  className="bg-card border border-border rounded-lg shadow-xl whitespace-nowrap"
                  style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem" }}
                >
                  <div className="font-medium text-foreground">{formatDate(day.date)}</div>
                  <div className="text-muted" style={{ marginTop: "0.125rem" }}>
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
      <div
        className="text-muted"
        style={{ display: "flex", justifyContent: "space-between", fontSize: "0.625rem", padding: "0 0.125rem" }}
      >
        <span>{dailyUptime.length} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export function UptimeBarsSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "2px", height: "1.75rem" }}>
        {Array.from({ length: 90 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted/30 rounded-sm animate-pulse"
            style={{ flex: 1, minWidth: 0 }}
          />
        ))}
      </div>
      <div
        className="text-muted"
        style={{ display: "flex", justifyContent: "space-between", fontSize: "0.625rem", padding: "0 0.125rem" }}
      >
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
