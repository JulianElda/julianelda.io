---
name: add-photos
description: Add photos from a folder to the /photos page of julianelda.io - run scripts/add-photo.sh on it, which strips all metadata and compresses each photo into content/photos/, then look at each new photo and give it a readable slug, caption and alt text with scripts/name-photo.sh. Use when Julian points at a folder (or files) of photos and asks to add, publish or put them on the photos page or the site.
---

# Add photos to /photos

Julian points at a folder. One script strips and compresses, you name what it
added, and Julian edits captions in `content/photos/photos.json` afterwards if
he wants. No approval round in between.

The agent shell does not load direnv, so run everything through
`nix develop -c`. Never write into the source folder. Do not commit unless
asked.

## 1. Add

From the repo root:

```bash
nix develop -c scripts/add-photo.sh <folder>
```

For each photo, oldest first, it removes all metadata, shrinks to fit 2400px,
converts to sRGB, checks the result is clean, and adds an entry at the top of
`photos.json` with a temporary hash slug and empty `caption` and `alt`. Photos
already in are skipped, so rerunning a folder is safe. Raw files are skipped
with a note; ask for a JPEG export.

Camera details are kept only for cameras, not phones. If Julian asks to show
or hide them for this batch, pass `--meta` or `--no-meta`.

If it stops with `unknown camera` or `unknown lens`, add the entry to
`scripts/photo-gear.json` (keys sorted) and rerun the same command:

- body, keyed by the EXIF `Model`: `name` (proper brand and model, e.g.
  `RICOH GR III` → `Ricoh GR III`), `kind` (`camera` or `phone`),
  `interchangeableLens`;
- lens, keyed by the EXIF `LensModel`: a clean name without the brand the
  camera already gives, with en dashes in ranges
  (`OLYMPUS M.14-42mm F3.5-5.6 II` → `M.Zuiko 14–42mm F3.5–5.6 II`).

## 2. Name each new photo

For every `added … as <hash>` line, look at the photo through a small preview:

```bash
nix develop -c vipsthumbnail content/photos/<hash>.jpg --size 800x800 \
  -o '<scratchpad>/preview/<hash>.jpg[Q=75]'
```

Then write:

- **slug**: 1–4 lowercase words joined by hyphens, from what is in the picture
  (`frost-and-fog`, `larch-slopes`), unique in `photos.json`. Never a date or
  camera filename.
- **caption**: short, lowercase, no full stop: `larches turning gold`,
  `a bench in the fog`, `two benches by the lake`.
- **alt**: one sentence describing what is visible for someone who cannot see
  it. No "photo of". For example:
  `Golden larches and dark spruce on a mountainside below a pale rock face`

and apply them:

```bash
nix develop -c scripts/name-photo.sh <hash> <slug> "<caption>" "<alt>"
```

## 3. Check and report

```bash
nix develop -c scripts/check-photo-metadata.sh content/photos/*.jpg
bun run check
bun run test:unit -- --run
```

Report a table of what was added (slug, caption) and anything skipped, and
any gear entry you added.
