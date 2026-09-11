// Date formatting for content dates. The content stores YYYY-MM and
// YYYY-MM-DD strings; these turn them into English without going through
// Date, so the output cannot shift with the build machine's time zone.

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// "2026-02" -> "February 2026"
export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

// "2026-02-17" -> "February 17, 2026"
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}

// A span of months: "June 2025 to August 2025", or "February 2026 to now".
export function formatSpan(start: string, end?: string): string {
  return `${formatMonth(start)} to ${end ? formatMonth(end) : "now"}`;
}
