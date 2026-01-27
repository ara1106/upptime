const OWNER = "ara1106";
const REPO = "upptime";

export interface ServiceStatus {
  name: string;
  url: string;
  icon?: string;
  slug: string;
  status: "up" | "down" | "degraded";
  uptime: string;
  uptimeDay: string;
  uptimeWeek: string;
  uptimeMonth: string;
  uptimeYear: string;
  time: number;
  timeDay: number;
  timeWeek: number;
  timeMonth: number;
  timeYear: number;
  dailyMinutesDown: Record<string, number>;
}

export interface Incident {
  id: number;
  title: string;
  body: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  labels: { name: string; color: string }[];
  html_url: string;
}

export async function fetchServiceStatuses(): Promise<ServiceStatus[]> {
  const response = await fetch(
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/history/summary.json`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch service statuses");
  }

  return response.json();
}

export async function fetchIncidents(): Promise<Incident[]> {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=all&labels=status&per_page=10`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    // Don't fail if we can't fetch incidents - just return empty
    console.warn("Failed to fetch incidents");
    return [];
  }

  return response.json();
}

export interface DailyUptime {
  date: Date;
  uptime: number | null; // null means no data
}

export function calculateDailyUptime(
  dailyMinutesDown: Record<string, number>,
  days: number = 90,
  serviceStartDate?: Date
): DailyUptime[] {
  const result: DailyUptime[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If we have any data, find the earliest date we have records for
  const recordedDates = Object.keys(dailyMinutesDown).sort();
  const earliestRecord = recordedDates.length > 0
    ? new Date(recordedDates[0])
    : serviceStartDate || today;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    const minutesDown = dailyMinutesDown[dateKey];

    // Determine uptime:
    // - If we have a record for this date, calculate from minutesDown
    // - If date is before our earliest record, show as "no data"
    // - If date is after earliest record but no entry, assume 100% (no downtime recorded)
    let uptime: number | null;

    if (minutesDown !== undefined) {
      uptime = Math.max(0, ((1440 - minutesDown) / 1440) * 100);
    } else if (date < earliestRecord) {
      uptime = null; // No data before monitoring started
    } else {
      uptime = 100; // No downtime recorded = 100% uptime
    }

    result.push({ date, uptime });
  }

  return result;
}

export function getLastUpdated(): Date {
  // Return current time as a reasonable approximation
  // The actual last check time would need to come from the API
  return new Date();
}
