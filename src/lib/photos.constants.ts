import type { Picture } from "@sveltejs/enhanced-img";

import type { Photo, PhotoWithImage } from "./photos.types";

import entries from "../../content/photos/photos.json";

// enhanced-img makes AVIF, WebP and JPEG at each width at build time. Prints
// are ~200px wide and the viewer fills the screen, so both draw from one set.
const images = import.meta.glob<Picture>("/content/photos/*.jpg", {
  eager: true,
  import: "default",
  query: "?enhanced&w=2400;1600;1200;800;400",
});

// An annotation, not `satisfies`: an empty photos.json is typed never[], which
// assigns to Photo[] but has no fields to read. Entries are still checked.
const photos: Photo[] = entries;

/** Every photo on /photos, in display order (newest added first). */
export const PHOTOS: PhotoWithImage[] = photos.map((photo) => {
  const image = images[`/content/photos/${photo.slug}.jpg`];
  if (!image) {
    throw new Error(
      `content/photos/photos.json lists "${photo.slug}" but content/photos/${photo.slug}.jpg is missing`,
    );
  }
  return Object.assign({ image }, photo);
});
