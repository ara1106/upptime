"use client";

import { cn, formatDateLong, getRelativeTime } from "@/lib/utils";
import type { Incident } from "@/lib/api";

interface IncidentTimelineProps {
  incidents: Incident[];
}

export function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  // Filter to recent incidents (last 90 days)
  const recentIncidents = incidents.filter((incident) => {
    const created = new Date(incident.created_at);
    const daysAgo = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 90;
  });

  if (recentIncidents.length === 0) {
    return (
      <div
        className="rounded-xl border-2 border-border bg-card overflow-hidden"
        style={{ padding: "1.25rem" }}
      >
        <h2 className="text-lg font-semibold" style={{ marginBottom: "1rem" }}>Recent Incidents</h2>
        <div className="flex items-center text-muted text-sm" style={{ gap: "0.75rem" }}>
          <svg
            className="text-status-up shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ width: "1.25rem", height: "1.25rem" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No incidents in the last 90 days</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border-2 border-border bg-card overflow-hidden"
      style={{ padding: "1.25rem" }}
    >
      <h2 className="text-lg font-semibold" style={{ marginBottom: "1rem" }}>Recent Incidents</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {recentIncidents.map((incident) => (
          <IncidentItem key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}

function IncidentItem({ incident }: { incident: Incident }) {
  const isResolved = incident.state === "closed";
  const created = new Date(incident.created_at);

  // Determine severity from labels
  const hasDownLabel = incident.labels.some((l) =>
    l.name.toLowerCase().includes("down")
  );
  const hasDegradedLabel = incident.labels.some((l) =>
    l.name.toLowerCase().includes("degraded")
  );

  const severity = hasDownLabel
    ? "down"
    : hasDegradedLabel
    ? "degraded"
    : "unknown";

  const severityConfig = {
    down: {
      dot: "bg-status-down",
      text: "text-status-down",
    },
    degraded: {
      dot: "bg-status-degraded",
      text: "text-status-degraded",
    },
    unknown: {
      dot: "bg-muted",
      text: "text-muted",
    },
  };

  const config = severityConfig[severity];

  return (
    <a
      href={incident.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg hover:bg-card-hover transition-colors"
      style={{ padding: "0.75rem" }}
    >
      <div className="flex items-start" style={{ gap: "0.75rem" }}>
        <span
          className={cn("rounded-full shrink-0", config.dot)}
          style={{ width: "0.5rem", height: "0.5rem", marginTop: "0.5rem" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap" style={{ gap: "0.5rem" }}>
            <span className="font-medium">{incident.title}</span>
            {isResolved && (
              <span
                className="text-xs rounded-full bg-status-up/20 text-status-up"
                style={{ padding: "0.125rem 0.5rem" }}
              >
                Resolved
              </span>
            )}
          </div>
          <div className="text-sm text-muted" style={{ marginTop: "0.25rem" }}>
            {formatDateLong(created)} &middot; {getRelativeTime(created)}
          </div>
        </div>
      </div>
    </a>
  );
}

export function IncidentTimelineSkeleton() {
  return (
    <div
      className="rounded-xl border-2 border-border bg-card animate-pulse"
      style={{ padding: "1.25rem" }}
    >
      <div className="rounded bg-muted" style={{ height: "1.5rem", width: "10rem", marginBottom: "1rem" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start" style={{ gap: "0.75rem", padding: "0.75rem" }}>
            <div
              className="rounded-full bg-muted shrink-0"
              style={{ width: "0.5rem", height: "0.5rem", marginTop: "0.5rem" }}
            />
            <div className="flex-1" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div className="rounded bg-muted" style={{ height: "1.25rem", width: "75%" }} />
              <div className="rounded bg-muted" style={{ height: "1rem", width: "50%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
