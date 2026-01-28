"use client";

import { useState } from "react";
import { cn, formatResponseTime } from "@/lib/utils";
import { calculateDailyUptime, type ServiceStatus } from "@/lib/api";
import { UptimeBars, UptimeBarsSkeleton } from "./UptimeBars";

interface ServiceCardProps {
  service: ServiceStatus;
}

// Keroppi frog icon for KeroHub services (inline SVG to avoid TLS issues)
function KeroppiIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
      <path fill="#a7da1c" d="M33.974,38h-20c-6.075,0-11-4.925-11-11l0,0c0-6.075,4.925-11,11-11h20c6.075,0,11,4.925,11,11l0,0 C44.974,33.075,40.049,38,33.974,38z"/>
      <path fill="#212121" d="M33.974,39.012h-20C7.351,39.012,1.962,33.623,1.962,27c0-6.624,5.389-12.012,12.012-12.012h20 c6.623,0,12.012,5.389,12.012,12.012C45.985,33.623,40.597,39.012,33.974,39.012z M13.974,17.012c-5.507,0-9.988,4.48-9.988,9.988 c0,5.508,4.48,9.988,9.988,9.988h20c5.508,0,9.988-4.48,9.988-9.988c0-5.507-4.48-9.988-9.988-9.988H13.974z"/>
      <circle cx="14.974" cy="13" r="9" fill="#fff"/>
      <path fill="#212121" d="M14.974,23c-5.514,0-10-4.486-10-10s4.486-10,10-10s10,4.486,10,10S20.488,23,14.974,23z M14.974,5 c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S19.385,5,14.974,5z"/>
      <circle cx="32.974" cy="13" r="9" fill="#fff"/>
      <path fill="#212121" d="M32.974,23c-5.514,0-10-4.486-10-10s4.486-10,10-10s10,4.486,10,10S38.487,23,32.974,23z M32.974,5 c-4.411,0-8,3.589-8,8s3.588,8,8,8s8-3.589,8-8S37.385,5,32.974,5z"/>
      <circle cx="17.974" cy="13" r="3" fill="#212121"/>
      <circle cx="30.974" cy="13" r="3" fill="#212121"/>
      <circle cx="37.474" cy="27.5" r="3.5" fill="#f57c00"/>
      <circle cx="10.474" cy="27.5" r="3.5" fill="#f57c00"/>
      <path fill="#212121" d="M24.125,34.625c-0.156,0-0.312-0.036-0.454-0.109l-5.151-2.625c-0.492-0.25-0.688-0.853-0.437-1.345 c0.251-0.492,0.853-0.687,1.345-0.437l4.683,2.386l4.386-2.374c0.485-0.263,1.093-0.083,1.355,0.402 c0.264,0.486,0.083,1.093-0.402,1.355l-4.849,2.625C24.453,34.585,24.289,34.625,24.125,34.625z"/>
      <path fill="#a7da1c" d="M11.345,44.844c-0.392,0-0.773-0.115-1.102-0.333l-1.695-1.125c-0.374,0.532-0.972,0.845-1.631,0.845c-0.835,0-1.569-0.503-1.869-1.281l-0.612-1.591C3.295,38.391,4.538,35,7.267,33.64c0.85-0.424,1.755-0.639,2.69-0.639c2.465,0,4.716,1.546,5.601,3.847l0.689,1.793c0.236,0.614,0.156,1.305-0.215,1.846c-0.375,0.547-0.99,0.873-1.646,0.873l0,0c-0.157,0-0.313-0.019-0.468-0.056l-0.662,2.133C12.996,44.278,12.227,44.844,11.345,44.844z"/>
      <path fill="#212121" d="M9.958,34.001c2.009,0,3.903,1.219,4.668,3.206l0.689,1.791c0.262,0.68-0.261,1.361-0.927,1.361c-0.1,0-0.204-0.016-0.309-0.049l-0.016-0.005c-0.084-0.027-0.169-0.039-0.253-0.039c-0.356,0-0.686,0.23-0.798,0.588l-0.709,2.285c-0.137,0.44-0.538,0.704-0.957,0.704c-0.188,0-0.379-0.053-0.551-0.167L8.962,42.46c-0.142-0.094-0.303-0.139-0.461-0.139c-0.286,0-0.566,0.147-0.722,0.414l0,0C7.583,43.069,7.25,43.23,6.917,43.23c-0.388,0-0.773-0.22-0.936-0.641l-0.611-1.59c-0.938-2.437,0.007-5.299,2.344-6.464C8.443,34.171,9.208,34.001,9.958,34.001 M9.958,32.001c-1.092,0-2.147,0.25-3.136,0.743c-3.186,1.588-4.643,5.529-3.319,8.972l0.612,1.591c0.449,1.168,1.549,1.923,2.802,1.923c0.647,0,1.254-0.201,1.754-0.563l1.018,0.675c0.494,0.328,1.067,0.501,1.657,0.501c1.323,0,2.475-0.848,2.867-2.111l0.43-1.384c0.887-0.076,1.702-0.549,2.215-1.296c0.558-0.813,0.68-1.849,0.324-2.772l-0.689-1.791C15.46,33.805,12.834,32.001,9.958,32.001L9.958,32.001z"/>
      <path fill="#a7da1c" d="M36.64,44.844c-0.882,0-1.651-0.565-1.913-1.407l-0.663-2.136c-0.143,0.038-0.305,0.059-0.467,0.059c-0.655,0-1.271-0.326-1.646-0.873c-0.372-0.541-0.452-1.231-0.215-1.847l0.688-1.791c0.886-2.302,3.136-3.848,5.601-3.848c0.936,0,1.841,0.215,2.69,0.638c2.73,1.361,3.974,4.752,2.832,7.72l-0.612,1.591c-0.3,0.778-1.033,1.281-1.868,1.281c-0.668,0-1.273-0.321-1.646-0.867l-1.678,1.146C37.414,44.729,37.033,44.844,36.64,44.844z"/>
      <path fill="#212121" d="M38.027,34.001c0.75,0,1.515,0.17,2.244,0.533c2.337,1.165,3.282,4.027,2.344,6.464l-0.612,1.591c-0.162,0.421-0.548,0.641-0.936,0.641c-0.332,0-0.666-0.161-0.861-0.496l0,0c-0.156-0.267-0.436-0.414-0.722-0.414c-0.158,0-0.319,0.045-0.461,0.139l-1.833,1.216c-0.172,0.114-0.363,0.167-0.551,0.167c-0.419,0-0.82-0.264-0.957-0.704l-0.709-2.285c-0.111-0.358-0.442-0.588-0.798-0.588c-0.084,0-0.169,0.013-0.253,0.039l-0.016,0.005c-0.105,0.033-0.208,0.049-0.309,0.049c-0.666,0-1.189-0.681-0.927-1.361l0.689-1.791C34.124,35.221,36.019,34.002,38.027,34.001 M38.028,32.001L38.028,32.001c-2.876,0-5.502,1.804-6.535,4.488l-0.689,1.791c-0.355,0.923-0.234,1.959,0.324,2.772c0.513,0.747,1.327,1.219,2.215,1.296l0.43,1.384c0.392,1.263,1.544,2.111,2.867,2.111c.59,0,1.163-.173,1.656-.501l1.018-.675c.5.362,1.107.563,1.754.563c1.253,0,2.353-.755,2.802-1.923l.612-1.591c1.325-3.443-.133-7.385-3.319-8.972C40.174,32.251,39.119,32.001,38.028,32.001L38.028,32.001z"/>
    </svg>
  );
}

// Default icon when no favicon available
function DefaultServiceIcon({ name }: { name: string }) {
  // Use Keroppi for KeroHub services
  const lowerName = name.toLowerCase();
  if (lowerName.includes("kerohub") || lowerName.includes("kero")) {
    return <KeroppiIcon />;
  }

  // Choose icon based on service name
  const iconPath = lowerName.includes("jellyfin")
    ? "M19.5 7.5l-1.5 1.5-4-4-4 4-1.5-1.5 5.5-5.5 5.5 5.5zM4.5 16.5l1.5-1.5 4 4 4-4 1.5 1.5-5.5 5.5-5.5-5.5z" // Media icon
    : lowerName.includes("auth")
    ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" // Lock icon
    : lowerName.includes("request") || lowerName.includes("seerr")
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
