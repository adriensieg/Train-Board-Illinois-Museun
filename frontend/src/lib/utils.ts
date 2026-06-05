/** Convert "HH:MM" 24h → "h:MM AM/PM" */
export function toAMPM(t: string): string {
  const [hStr, m] = t.split(":");
  const h = parseInt(hStr, 10);
  return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
}

/** Convert "HH:MM" → total minutes (for sorting / comparison) */
export function toMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Current time in minutes since midnight */
export function nowMins(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}
