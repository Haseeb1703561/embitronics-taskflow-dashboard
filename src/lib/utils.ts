import { type ClassValue, clsx } from "clsx";
import { format, isPast, isToday, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateLabel(value?: string | Date | null) {
  if (!value) {
    return "No due date";
  }

  const date = value instanceof Date ? value : parseISO(value);
  return format(date, "MMM d, yyyy");
}

export function getDueDateTone(value?: string | Date | null) {
  if (!value) {
    return "text-slate-400";
  }

  const date = value instanceof Date ? value : parseISO(value);

  if (isToday(date)) {
    return "text-amber-300";
  }

  if (isPast(date)) {
    return "text-rose-300";
  }

  return "text-slate-300";
}

export function formatRelativeSummary(count: number, label: string) {
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}
