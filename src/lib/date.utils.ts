const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(date: string): string {
  return DATE_FORMATTER.format(new Date(date));
}
