import { expect, test } from "vitest";

import { formatDate, formatMediumDate, formatShortDate } from "./date.utils";

test("formatShortDate formats day and month", () => {
  expect(formatShortDate("2026-07-26")).toBe("26 Jul");
});

test("formatMediumDate formats day, short month and year", () => {
  expect(formatMediumDate("2026-07-26")).toBe("26 Jul 2026");
});

test("formatDate formats day, long month and year", () => {
  expect(formatDate("2026-07-26")).toBe("26 July 2026");
});
