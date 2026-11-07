# julianelda.io

## Project overview

Personal website and blog for a single author (me). Single public repo, no multi-tenant
or multi-author concerns anywhere in the design. Hosted on Vercel as the primary domain.

- `/` — redirects (307) to `/home`
- `/home` — homepage (About: intro, Currently, Recent writings, Contact)
- `/contact` — redirects (308) to `/home`; contact links live on the homepage
- `/projects` — project list
- `/photos` — curated photos as prints in a masonry wall, each opening in a viewer
- `/posts` — blog ("Writing"), all posts grouped by year
- `/posts/[slug]` — individual post

There is no backend service, no user accounts, and no runtime database. Every request is
either statically generated at build time or trivially computed from files already in the
repo. Publishing a post is a git push, not an API call.

## Tech stack

- **SvelteKit** + **TypeScript**
- **Bun** — package manager and runtime
- **Tailwind CSS v4** — styling. Colours and fonts are bespoke tokens in
  `src/routes/layout.css` (`--ink-*` light "stationery" theme, `--chalk-*` dark "blackboard"
  theme), exposed through semantic variables (`--paper`, `--text`, `--note`, `--muted`,
  `--accent`, …) and an `@theme inline` block as utilities (`bg-paper`, `text-note`, …).
  Post bodies are styled by the custom `.post-body` rules there, not a typography plugin.
  Headings get chalk wear (`.chalk`) and the blackboard's nav highlighter a smear, from
  the SVG filters `#chalk` and `#smear` rendered once in `src/routes/+layout.svelte`.
- **Fonts** — Heliotrope 3 (body, `font-body`) and Heliotrope 4 (headings, `font-display`),
  licensed from MB Type, via the private `@julianelda-private/heliotrope` package;
  IBM Plex Mono (`font-mono`) via `@fontsource/ibm-plex-mono`
- **mdsvex** — markdown/MDX (`.svx`) processing for posts
- **shiki** — code syntax highlighting, wired into mdsvex's `highlight` option (not
  mdsvex's default Prism highlighter)
- **@sveltejs/enhanced-img** — image optimization via `<enhanced:img>`
- **@sveltejs/adapter-vercel** (or `adapter-auto`) — deployment target

See [AGENTS.md](AGENTS.md) for coding conventions (naming, TypeScript, Svelte, styling,
testing). This file covers project shape and content/routing architecture; it doesn't
duplicate those rules.

## Content architecture

Plain git + MDX. Deliberately no CMS — see Non-goals below.

- Posts live at `content/posts/<slug>/index.svx`.
- Any images used by a post are co-located in that same `<slug>/` folder, not in a shared
  `static/` assets bucket.
- Publishing flow: write the file, commit, push to `main`, Vercel rebuilds and deploys.
  There is no admin UI, no database, no auth.

### Frontmatter schema

Every post's frontmatter has these fields (all required except `updated`):

| Field         | Type                | Notes                                                                                                                                            |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`       | `string`            |                                                                                                                                                  |
| `slug`        | `string`            | Should match the `<slug>` folder name under `content/posts/`                                                                                     |
| `description` | `string`            |                                                                                                                                                  |
| `date`        | `string`            | Used for sort order on `/posts` (descending)                                                                                                     |
| `draft`       | `boolean`           | See draft workflow below                                                                                                                         |
| `updated`     | `string` (optional) | Manually set only when a post is substantively revised after publishing. Renders an "Updated" date on the post page when it differs from `date`. |

Frontmatter is trusted as-is — there is no validation layer parsing or checking it (see
Non-goals). Keep new fields off this list unless you're deliberately extending the schema.

### Draft workflow

- `draft: true` excludes the post from the production build, but it's still visible when
  running `bun run dev`.
- Flip to `draft: false` and push to publish.

## Routing conventions

- `src/routes/+page.ts` — redirects (307) to `/home`.
- `src/routes/+layout.svelte` — renders the chalk filters, the theme corner (`theme-corner`), the sticky
  header (`site-header`) and a 680px content column for every page. No footer.
- `src/routes/home/` — About page; its server load takes the 3 latest posts from
  `getPosts()`.
- `src/routes/contact/+page.ts` — redirects (308) to `/home`.
- `src/routes/posts/+page.svelte` (+ a load function) — every post, grouped by year with
  `groupPostsByYear()` (`src/lib/posts.utils.ts`), newest first. No pagination — this is
  intentionally the simplest thing that works at personal-blog scale.
- `src/routes/posts/[slug]/+page.svelte` — individual post, statically generated from
  `content/posts/<slug>/index.svx`. The load also imports the raw source to compute
  reading time (`getReadingMinutes()`, 200 words per minute).
- `src/routes/projects/+page.svelte` — project cards from `src/lib/projects.constants.ts`.
- `src/routes/photos/+page.svelte` — every photo in `PHOTOS` (`src/lib/photos.constants.ts`) as a
  `photo-print`, opening in `photo-viewer` (a native modal `<dialog>`).

## Photos

`/photos` is curated: posts may show its photos, but a post's own co-located images never appear
on it. To add photos from a folder, use the `add-photos` skill (`.claude/skills/add-photos/`).

- `content/photos/<slug>.jpg` plus `content/photos/photos.json`, an array in display order (newest
  first). The slug is the filename and the handle posts use; it is never the shot date or the
  camera's filename, and there are no date folders. `add-photo.sh` gives new photos a hash
  slug and empty `caption` and `alt`; `scripts/name-photo.sh <slug> <new-slug> <caption> <alt>`
  renames the JPEG and its entry together. Never rename one without the other.
- **Every website copy has no metadata at all**: no GPS, dates, serial numbers or camera tags. The
  camera details the page shows live in `photos.json`, and only for photos that show them. The
  repo is public, so details left out there are not just hidden but absent.
- `scripts/add-photo.sh [--meta | --no-meta] <file or folder>...` is the only way in. It adds
  photos oldest first (newest ends on top) and skips any whose processed bytes match a JPEG already
  in `content/photos/`, whatever its slug. It applies the EXIF rotation to the pixels, shrinks to
  fit 2400px, converts to sRGB, drops all metadata (`vipsthumbnail … [keep=none]`), and runs the
  check below on its own output. It reads only camera, lens, focal length, aperture, shutter and
  ISO from the original, mapped through `scripts/photo-gear.json` (display names; `kind` `camera`
  or `phone`; `interchangeableLens`). An unknown camera or lens stops it: add it to that file.
  Details are written for cameras and left out for phones unless `--meta`/`--no-meta` says
  otherwise.
- Display rules (`src/lib/photos.utils.ts`): the lens, and the focal length as recorded (not
  35mm-equivalent), only for interchangeable lenses; shutter speeds as recorded (`1/53s`).
- `scripts/check-photo-metadata.sh` allows a fixed set of structural exiftool groups and fails on
  anything else. lefthook runs it with `--staged` on every staged image under `content/`, checking
  the staged blob rather than the working tree.
- In a post: `import Photo from "$lib/components/photo/photo.svelte"` in the `.svx` script block,
  then `<Photo slug="…" />`. `src/lib/photos.test.ts` fails on a slug missing from `photos.json`,
  and on a JPEG and `photos.json` that disagree.
- `@sveltejs/enhanced-img` makes AVIF/WebP/JPEG at 400–2400px at build time; it never enlarges.
  Uncached that costs ~5s per photo; the cache lives in `node_modules/.cache/imagetools`.

## File structure

```
julianelda.io/
├── content/
│   ├── photos/
│   │   ├── photos.json            # /photos entries, display order
│   │   └── <slug>.jpg             # metadata-free, ≤2400px (scripts/add-photo.sh)
│   └── posts/
│       └── <slug>/
│           ├── index.svx          # post body + frontmatter
│           └── *.{png,jpg,svg,…}  # co-located post images
├── src/
│   ├── lib/
│   │   └── components/            # site-header, theme-corner, section-heading,
│   │                              #   leader-row, project-card, photo-print,
│   │                              #   photo-viewer, photo (for posts)
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.ts               # redirects (307) to /home
│       ├── layout.css             # tokens, @font-face, .marker, .post-body
│       ├── home/                  # About page
│       ├── contact/+page.ts       # redirects (308) to /home
│       ├── projects/+page.svelte
│       ├── photos/+page.svelte
│       └── posts/
│           ├── +page.svelte       # all posts, grouped by year
│           └── [slug]/
│               └── +page.svelte   # individual post
├── scripts/
│   ├── add-photo.sh               # the only way a photo enters content/photos/
│   ├── name-photo.sh              # readable slug, caption, alt for an added photo
│   ├── check-photo-metadata.sh    # pre-commit: images carry no metadata
│   └── photo-gear.json            # camera and lens display names
├── static/                        # served at the site root, unhashed
│   ├── favicon.ico                # must stay at / — external fetchers
│   ├── favicon.svg                #   (Vercel, crawlers, unfurlers) look
│   ├── apple-touch-icon.png       #   there, not in the HTML head
│   └── robots.txt
├── vite.config.ts                 # SvelteKit + mdsvex + Tailwind + Vitest config
│                                   # (no separate svelte.config.js — mdsvex/adapter
│                                   #  options live here, on the sveltekit() plugin)
├── AGENTS.md                      # coding conventions
└── CLAUDE.md                      # this file
```

## Fonts

Heliotrope is licensed from MB Type, and the licence forbids storing the font files
anywhere non-licensees can reach. This repo is public, so **never commit them**.
They come from the private `@julianelda-private/heliotrope` package on GitHub Packages
(repo `julianelda-private/heliotrope`), whose `heliotrope-3.css` and `heliotrope-4.css`
hold the `@font-face` rules that `layout.css` imports; Vite bundles the woff2 from there.

- `.npmrc` sends the `@julianelda-private` scope to `npm.pkg.github.com`, authenticated
  by `NPM_GITHUB_TOKEN`: a classic PAT with only `read:packages` (fine-grained tokens
  do not work with the npm registry). Set it in your shell and on Vercel; without it,
  `bun install` fails with a 401.
- To update the fonts, publish a new version from the heliotrope repo (bump
  `package.json`, push a matching `v*` tag) and bump the dependency here.

## Non-goals

The following were considered and deliberately deferred or rejected — do not introduce
any of them without asking first:

- No CMS backend of any kind (not Sveltia, not Decap, not a Supabase-backed admin panel)
- No Zod/Velite content validation layer — frontmatter is trusted as-is for now
- No RSS feed, sitemap, OG image generation, comments (giscus), search (Pagefind), or
  analytics yet — these were considered and deliberately deferred, not forgotten

## Commands

```
bun run dev       # vite dev server
bun run build     # vite build (production)
bun run preview   # preview the production build locally
bun run check     # svelte-kit sync && svelte-check
bun run lint      # oxlint && eslint .
bun run format    # oxfmt
bun run test      # test:unit (vitest, --run) then test:e2e (playwright)
```

## Agent workflow notes

- Before running `bun run dev`, check whether a dev server is already running (e.g.
  `ps aux | grep vite`). If Vite reports port 5173 in use and falls back to 5174, that
  means a server is already up — kill the newly-spawned duplicate and reuse the existing
  one instead of leaving two instances running.
- Invoke the `playwright-cli` skill via `bunx playwright-cli ...`, not `npx` — this repo
  uses Bun as its package manager/runtime.
- `flake.nix` (loaded by direnv via `.envrc`) provides bun, node, exiftool, vips and jq (for the
  photo scripts) and the Playwright browsers. The agent's shell does not load direnv, so run those
  tools via `nix develop -c …`. The browsers come from the flake because on NixOS the ones
  Playwright downloads itself cannot run. They only work with the npm Playwright of the same version, so `playwright` and
  `@playwright/test` are pinned exactly to the flake's `playwright-driver`, and
  `overrides` in `package.json` forces `@playwright/cli` onto that same `playwright-core`
  instead of its bundled alpha. After `nix flake update`, the shell prints the
  `bun add` line that re-pins them; update the `overrides` to match.
