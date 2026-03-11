export const TASK_STATUSES = [
  "To Do",
  "In Progress",
  "In Review",
  "Done",
] as const;

export const TASK_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Urgent",
] as const;

export const STATUS_BADGE_STYLES: Record<(typeof TASK_STATUSES)[number], string> = {
  "To Do": "bg-slate-800 text-slate-200 border-slate-700",
  "In Progress": "bg-blue-500/15 text-blue-200 border-blue-400/30",
  "In Review": "bg-amber-500/15 text-amber-200 border-amber-400/30",
  Done: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
};

export const PRIORITY_BADGE_STYLES: Record<
  (typeof TASK_PRIORITIES)[number],
  string
> = {
  Low: "bg-slate-800 text-slate-200 border-slate-700",
  Medium: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  High: "bg-orange-500/15 text-orange-200 border-orange-400/30",
  Urgent: "bg-rose-500/15 text-rose-200 border-rose-400/30",
};

export const STATUS_CHART_COLORS: Record<(typeof TASK_STATUSES)[number], string> = {
  "To Do": "#64748b",
  "In Progress": "#3b82f6",
  "In Review": "#f59e0b",
  Done: "#10b981",
};

export const DASHBOARD_NAVIGATION = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
] as const;
