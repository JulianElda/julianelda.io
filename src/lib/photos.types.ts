import type { Picture } from "@sveltejs/enhanced-img";

/** One entry of content/photos/photos.json, written by scripts/add-photo.sh. */
export interface Photo {
  alt: string;
  caption: string;
  /** Kept off /photos, but posts can still show it, e.g. a screenshot. */
  hidden?: boolean;
  /**
   * Absent when the page shows none, which is the default for phones. The repo
   * is public, so details the page hides are not stored either.
   */
  meta?: PhotoMeta;
  /** Also the filename: content/photos/<slug>.jpg. */
  slug: string;
}

/** Only interchangeable lenses are named; fixed-lens cameras have none. */
export interface PhotoLens {
  /** As recorded, not the 35mm equivalent. */
  focalLength?: number;
  name: string;
}

export interface PhotoMeta {
  aperture?: number;
  camera: string;
  iso?: number;
  lens?: PhotoLens;
  /** As recorded: "1/160" below a second, plain seconds ("2") from there. */
  shutter?: string;
}

export interface PhotoWithImage extends Photo {
  image: Picture;
}
