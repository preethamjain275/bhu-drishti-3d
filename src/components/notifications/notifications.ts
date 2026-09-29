/**
 * Demo notification data + types.
 *
 * This module is the single seam for notifications. A later phase can replace
 * `fetchNotifications` with a real service (websocket / Cloud function /
 * push subscription) without touching any UI component.
 */

export type NotificationCategory =
  | "conflict"
  | "processing"
  | "verification"
  | "harmonization"
  | "evidence";

export type NotificationPriority = "critical" | "high" | "normal";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  /** ISO timestamp */
  createdAt: string;
  read: boolean;
};

export const categoryLabel: Record<NotificationCategory, string> = {
  conflict: "Conflict",
  processing: "Processing",
  verification: "Verification",
  harmonization: "Harmonization",
  evidence: "Evidence",
};

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const demoNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Verification required",
    body: "3 conflicts require verification",
    category: "conflict",
    priority: "critical",
    createdAt: minutesAgo(4),
    read: false,
  },
  {
    id: "n2",
    title: "Source Update",
    body: "Source quality changed for Municipal GIS",
    category: "processing",
    priority: "normal",
    createdAt: minutesAgo(26),
    read: false,
  },
  {
    id: "n3",
    title: "AI Analysis",
    body: "New entity match detected",
    category: "harmonization",
    priority: "high",
    createdAt: minutesAgo(92),
    read: false,
  },
  {
    id: "n4",
    title: "3D Engine",
    body: "3D parcel visualization ready",
    category: "processing",
    priority: "normal",
    createdAt: minutesAgo(240),
    read: true,
  },
];

export async function fetchNotifications(): Promise<AppNotification[]> {
  // Demo source. Replace with a real transport in a later phase.
  return demoNotifications;
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
