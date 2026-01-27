import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatUptime(uptime: string): string {
  // Remove the % if present and format
  const value = parseFloat(uptime.replace("%", ""));
  return `${value.toFixed(2)}%`;
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export type Status = "up" | "degraded" | "down" | "maintenance" | "unknown";

export function getOverallStatus(services: { status: string }[]): Status {
  if (services.length === 0) return "unknown";

  const hasDown = services.some((s) => s.status === "down");
  const hasDegraded = services.some((s) => s.status === "degraded");

  if (hasDown) return "down";
  if (hasDegraded) return "degraded";
  return "up";
}

export function getStatusLabel(status: Status): string {
  switch (status) {
    case "up":
      return "All Systems Operational";
    case "degraded":
      return "Some Systems Degraded";
    case "down":
      return "System Outage";
    case "maintenance":
      return "Under Maintenance";
    default:
      return "Status Unknown";
  }
}
