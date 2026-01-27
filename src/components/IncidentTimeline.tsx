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
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6 overflow-hidden">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Incidents</h2>
        <div className="flex items-center gap-2 sm:gap-3 text-muted text-sm">
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-status-up shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
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
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6 overflow-hidden">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Incidents</h2>
      <div className="space-y-3 sm:space-y-4">
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
      className="block p-4 -mx-2 rounded-md hover:bg-card-hover transition-colors"
    >
      <div className="flex items-start gap-3">
        <span className={cn("h-2 w-2 rounded-full mt-2 shrink-0", config.dot)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{incident.title}</span>
            {isResolved && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-status-up/20 text-status-up">
                Resolved
              </span>
            )}
          </div>
          <div className="text-sm text-muted mt-1">
            {formatDateLong(created)} &middot; {getRelativeTime(created)}
          </div>
        </div>
      </div>
    </a>
  );
}

export function IncidentTimelineSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
      <div className="h-6 w-40 rounded bg-muted mb-4" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <div className="h-2 w-2 rounded-full bg-muted mt-2" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
