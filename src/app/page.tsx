"use client";

import { useEffect, useState, useCallback } from "react";
import { StatusBanner, StatusBannerSkeleton } from "@/components/StatusBanner";
import { ServiceCard, ServiceCardSkeleton } from "@/components/ServiceCard";
import {
  IncidentTimeline,
  IncidentTimelineSkeleton,
} from "@/components/IncidentTimeline";
import {
  fetchServiceStatuses,
  fetchIncidents,
  type ServiceStatus,
  type Incident,
} from "@/lib/api";
import { getOverallStatus } from "@/lib/utils";

// Slug → category. Slugs are derived from service `name` in .upptimerc.yml
// via lodash kebab-case (e.g. "SSO Login" → "sso-login", "KeroHub" → "kero-hub").
// Source of truth for groups: configs/services-registry.yaml in the remlab monorepo.
const SERVICE_GROUPS: Record<string, string> = {
  "kero-hub": "Identity",
  "sso-login": "Identity",
  "password-vault": "Identity",
  jellyfin: "Media",
  jellyseerr: "Media",
  "kero-place": "Community",
  "community-forum": "Community",
  opengist: "Dev",
};

const GROUP_ORDER = ["Identity", "Media", "Community", "Dev", "Other"];

function groupServices(services: ServiceStatus[]): Array<[string, ServiceStatus[]]> {
  const buckets = new Map<string, ServiceStatus[]>();
  for (const svc of services) {
    const group = SERVICE_GROUPS[svc.slug] ?? "Other";
    if (!buckets.has(group)) buckets.set(group, []);
    buckets.get(group)!.push(svc);
  }
  return GROUP_ORDER
    .filter((g) => buckets.has(g))
    .map((g) => [g, buckets.get(g)!] as [string, ServiceStatus[]]);
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [servicesData, incidentsData] = await Promise.all([
        fetchServiceStatuses(),
        fetchIncidents(),
      ]);
      setServices(servicesData);
      setIncidents(incidentsData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to load status data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  const overallStatus = getOverallStatus(services);

  return (
    <main>
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <img
            src="/rem-icon.png"
            alt=""
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg shrink-0"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">RemLab Status</h1>
        </div>
        <p className="text-muted text-sm sm:text-base">
          Real-time status and historical uptime for RemLab services
        </p>
      </header>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-status-down/10 border border-status-down/30 text-status-down">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={loadData}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Status Banner */}
      <section className="mb-6 sm:mb-8">
        {loading ? (
          <StatusBannerSkeleton />
        ) : (
          <StatusBanner status={overallStatus} lastUpdated={lastUpdated} />
        )}
      </section>

      {/* Services, grouped by category */}
      <section className="mb-6 sm:mb-8 space-y-6 sm:space-y-8">
        {loading ? (
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h2>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          groupServices(services).map(([group, groupItems]) => (
            <div key={group}>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-baseline gap-2">
                <span>{group}</span>
                <span className="text-xs font-normal text-muted">
                  {groupItems.length}
                </span>
              </h2>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {groupItems.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Incidents */}
      <section className="mb-6 sm:mb-8">
        {loading ? (
          <IncidentTimelineSkeleton />
        ) : (
          <IncidentTimeline incidents={incidents} />
        )}
      </section>

      {/* Footer */}
      <footer className="pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted/80">
        <p>
          Powered by{" "}
          <a
            href="https://upptime.js.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-foreground hover:underline"
          >
            Upptime
          </a>
          {" "}&middot;{" "}
          <a
            href="https://kero-ara.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-foreground hover:underline"
          >
            KeroHub
          </a>
        </p>
      </footer>
    </main>
  );
}
