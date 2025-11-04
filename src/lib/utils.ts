import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------- Daily check-in / streak utilities (localStorage-backed) ----------
const CHECKIN_KEY = "dailyCheckins";

function toISODate(d: Date) {
  // Use local date (YYYY-MM-DD) to avoid UTC vs local-day mismatches that
  // can cause 'today' to be off near midnight in some timezones.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getCheckinDates(): string[] {
  try {
    const raw = localStorage.getItem(CHECKIN_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return Array.from(new Set(arr));
  } catch {
    return [];
  }
}

export function hasCheckedInToday(): boolean {
  const today = toISODate(new Date());
  return getCheckinDates().includes(today);
}

export function recordCheckin(): number {
  const today = toISODate(new Date());
  const dates = new Set(getCheckinDates());
  dates.add(today);
  try {
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(Array.from(dates)));
  } catch {}
  return getStreak();
}

export function getStreak(): number {
  const dates = getCheckinDates().slice().sort().reverse(); // newest first
  if (dates.length === 0) return 0;

  // Count consecutive days ending today
  const today = new Date();
  let streak = 0;
  let cursor = new Date(toISODate(today));

  const dateSet = new Set(dates);
  while (true) {
    const iso = toISODate(cursor);
    if (dateSet.has(iso)) {
      streak += 1;
      // subtract 1 day
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

