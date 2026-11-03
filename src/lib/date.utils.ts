const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
});
const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const MEDIUM_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

/** "26 July 2026" */
export function formatDate(date: string): string {
  return DATE_FORMATTER.format(new Date(date));
}

/** "26 Jul 2026" */
export function formatMediumDate(date: string): string {
  return MEDIUM_DATE_FORMATTER.format(new Date(date));
}

/** "26 Jul" */
export function formatShortDate(date: string): string {
  return SHORT_DATE_FORMATTER.format(new Date(date));
}
