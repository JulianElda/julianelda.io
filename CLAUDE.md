# julianelda.io

## Project overview

Personal website and blog for a single author (me). Single public repo, no multi-tenant
or multi-author concerns anywhere in the design. Hosted on Vercel as the primary domain.

- `/` — redirects (307) to `/home`
- `/home` — homepage (About: intro, Currently, Recent writings, Contact)
- `/contact` — redirects (308) to `/home`; contact links live on the homepage
- `/projects` — project list
- `/posts` — blog ("Writing"), all posts grouped by year
- `/posts/[slug]` — individual post

There is no backend service, no user accounts, and no runtime database. Every request is
either statically generated at build time or trivially computed from files already in the
repo. Publishing a post is a git push, not an API call.

## Tech stack

- **SvelteKit** + **TypeScript**
- **Bun** — package manager and runtime
- **Tailwind CSS v4** — styling. Colours and fonts are bespoke tokens in
  `src/routes/layout.css` (`--ink-*` light "stationery" theme, `--film-*` dark "darkroom"
  theme), exposed through semantic variables (`--paper`, `--text`, `--note`, `--muted`,
  `--accent`, …) and an `@theme inline` block as utilities (`bg-paper`, `text-note`, …).
  Post bodies are styled by the custom `.post-body` rules there, not a typography plugin.
- **Fonts** — Heliotrope 3 (body, `font-body`) and Heliotrope 4 (headings, `font-display`),
  licensed from MB Type; IBM Plex Mono (`font-mono`) via `@fontsource/ibm-plex-mono`
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
- `src/routes/+layout.svelte` — renders the theme corner (`theme-corner`), the sticky
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

## File structure

```
julianelda.io/
├── content/
│   └── posts/
│       └── <slug>/
│           ├── index.svx          # post body + frontmatter
│           └── *.{png,jpg,svg,…}  # co-located post images
├── src/
│   ├── lib/
│   │   ├── components/            # site-header, theme-corner, section-heading,
│   │   │                          #   leader-row, project-card
│   │   └── fonts/                 # Heliotrope woff2, gitignored (see Fonts)
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.ts               # redirects (307) to /home
│       ├── layout.css             # tokens, @font-face, .marker, .post-body
│       ├── home/                  # About page
│       ├── contact/+page.ts       # redirects (308) to /home
│       ├── projects/+page.svelte
│       └── posts/
│           ├── +page.svelte       # all posts, grouped by year
│           └── [slug]/
│               └── +page.svelte   # individual post
├── scripts/
│   └── fetch-fonts.ts             # fills src/lib/fonts/ before dev/build
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
`src/lib/fonts/` is gitignored and filled by `scripts/fetch-fonts.ts`, which runs before
`dev` and `build`:

- Locally, copy the eight `heliotrope_{3,4}_{regular,italic,bold,bold_italic}.woff2` files
  into `src/lib/fonts/` once from the licensed download; the script then exits without a
  network call.
- On Vercel (or anywhere the files are missing), set `FONTS_TOKEN` to a fine-grained token
  with read-only Contents access to the private `JulianElda/fonts` repo; the script
  downloads them from its `heliotrope/` folder.
- With neither, `dev` and `build` fail with a message naming the missing files.

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
- `flake.nix` (loaded by direnv via `.envrc`) provides bun, node and the Playwright
  browsers: on NixOS the browsers Playwright downloads itself cannot run. Those browsers
  only work with the npm Playwright of the same version, so `playwright` and
  `@playwright/test` are pinned exactly to the flake's `playwright-driver`, and
  `overrides` in `package.json` forces `@playwright/cli` onto that same `playwright-core`
  instead of its bundled alpha. After `nix flake update`, the shell prints the
  `bun add` line that re-pins them; update the `overrides` to match.
