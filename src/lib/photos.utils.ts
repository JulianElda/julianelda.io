import type { PhotoMeta } from "./photos.types";

const SEPARATOR = " · ";

/** "ƒ/5.6 · 1/160s · ISO 200", or undefined when nothing was recorded. */
export function formatExposure(meta: PhotoMeta): string | undefined {
  const parts = [
    meta.aperture === undefined ? undefined : `ƒ/${meta.aperture}`,
    meta.shutter === undefined ? undefined : `${meta.shutter}s`,
    meta.iso === undefined ? undefined : `ISO ${meta.iso}`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(SEPARATOR) : undefined;
}

/** "Olympus E-M1 Mark III · M.Zuiko 14–42mm F3.5–5.6 II · 42mm" */
export function formatGear(meta: PhotoMeta): string {
  const focalLength = meta.lens?.focalLength;
  return [
    meta.camera,
    meta.lens?.name,
    focalLength === undefined ? undefined : `${focalLength}mm`,
  ]
    .filter(Boolean)
    .join(SEPARATOR);
}
