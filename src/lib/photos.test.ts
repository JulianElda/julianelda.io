import { expect, test } from "vitest";

import type { Photo } from "./photos.types";

import entries from "../../content/photos/photos.json";

const photos: Photo[] = entries;

// Keys only: the glob is lazy, so no image is loaded. Posts come in raw, so
// none is compiled either.
const imagePaths = Object.keys(
  import.meta.glob(["/content/photos/*", "!/content/photos/photos.json"]),
);
const postSources = import.meta.glob<string>("/content/posts/*/index.svx", {
  eager: true,
  import: "default",
  query: "?raw",
});

test("every photo in photos.json has its JPEG", () => {
  const missing = photos
    .map((photo) => `/content/photos/${photo.slug}.jpg`)
    .filter((path) => !imagePaths.includes(path));

  expect(missing).toStrictEqual([]);
});

test("every file in content/photos is listed in photos.json", () => {
  const listed = new Set(
    photos.map((photo) => `/content/photos/${photo.slug}.jpg`),
  );
  const unlisted = imagePaths.filter((path) => !listed.has(path));

  expect(unlisted).toStrictEqual([]);
});

test("photo slugs are unique", () => {
  const slugs = photos.map((photo) => photo.slug);

  expect(new Set(slugs).size).toBe(slugs.length);
});

test("every <Photo slug> in a post is in photos.json", () => {
  const slugs = new Set(photos.map((photo) => photo.slug));
  const used = Object.values(postSources).flatMap((source) =>
    [...source.matchAll(/<Photo\s[^>]*slug="([^"]+)"/g)].flatMap((match) =>
      match.slice(1),
    ),
  );
  const unknown = used.filter((slug) => !slugs.has(slug));

  expect(unknown).toStrictEqual([]);
});
