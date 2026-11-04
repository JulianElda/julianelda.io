import { expect, test } from "vitest";

import { formatExposure, formatGear } from "./photos.utils";

test("formatGear names an interchangeable lens with its focal length", () => {
  expect(
    formatGear({
      camera: "Olympus E-M1 Mark III",
      lens: { focalLength: 42, name: "M.Zuiko 14–42mm F3.5–5.6 II" },
    }),
  ).toBe("Olympus E-M1 Mark III · M.Zuiko 14–42mm F3.5–5.6 II · 42mm");
});

test("formatGear gives only the camera for a fixed-lens camera", () => {
  expect(formatGear({ aperture: 4, camera: "Ricoh GR III" })).toBe(
    "Ricoh GR III",
  );
});

test("formatGear leaves out a focal length the lens did not record", () => {
  expect(
    formatGear({
      camera: "Olympus E-M1 Mark III",
      lens: { name: "M.Zuiko 14–42mm F3.5–5.6 II" },
    }),
  ).toBe("Olympus E-M1 Mark III · M.Zuiko 14–42mm F3.5–5.6 II");
});

test("formatExposure writes aperture, shutter and ISO", () => {
  expect(
    formatExposure({
      aperture: 5.6,
      camera: "Olympus E-M1 Mark III",
      iso: 200,
      shutter: "1/160",
    }),
  ).toBe("ƒ/5.6 · 1/160s · ISO 200");
});

test("formatExposure keeps an odd shutter speed as recorded", () => {
  expect(
    formatExposure({
      aperture: 5.9,
      camera: "Rollei Compactline 203",
      shutter: "1/53",
    }),
  ).toBe("ƒ/5.9 · 1/53s");
});

test("formatExposure writes long exposures in whole seconds", () => {
  expect(formatExposure({ camera: "Ricoh GR III", shutter: "2" })).toBe("2s");
});

test("formatExposure is undefined when nothing was recorded", () => {
  expect(formatExposure({ camera: "Sony Ericsson W810i" })).toBeUndefined();
});
