import { type ClassValue, clsx } from "clsx";
import { setDate } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkString = (val?: string) => !!(val && val.trim().length > 0);

/**
 * Clamp a desired day-of-month into a valid date within a given month.
 *
 * Ensures that the returned date:
 * - stays in the same month and year as the input `date`
 * - never exceeds the number of days in that month
 * - never becomes < 1
 *
 * Examples:
 *   clampDayToMonth(31, new Date("2025-02-01")) → Feb 28 (or Feb 29 in leap years)
 *   clampDayToMonth(15, new Date("2025-04-01")) → Apr 15
 *
 * @param day - Desired day-of-month (1–31)
 * @param date - Any date inside the target month
 * @returns A new Date with the clamped & valid day-of-month
 */
export const clampDayToMonth = (day: number, date: Date) => {
  // returns a Date in same month with day clamped to last day if needed
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const d = Math.min(Math.max(1, day), lastDay);
  return setDate(date, d);
};
