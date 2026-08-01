# julianelda.io

## Project overview

Personal website and blog for a single author (me). Single public repo, no multi-tenant
or multi-author concerns anywhere in the design. Hosted on Vercel as the primary domain.

- `/` — redirects (307) to `/home`
- `/home` — homepage
- `/contact` — contact/social links
- `/projects` — project list
- `/posts` — blog, paginated list of posts
- `/posts/[slug]` — individual post

There is no backend service, no user accounts, and no runtime database. Every request is
either statically generated at build time or trivially computed from files already in the
repo. Publishing a post is a git push, not an API call.

## Tech stack

- **SvelteKit** + **TypeScript**
- **Bun** — package manager and runtime
- **Tailwind CSS v4** + `@tailwindcss/typography` — styling, prose formatting for post
  content
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
- `src/routes/(prose)/` — route group for prose/markdown-driven pages (`home`, `contact`,
  `projects`, and future posts). Its `+layout.svelte` applies the shared `prose` wrapper
  classes once, so individual pages inside the group don't repeat them. Non-prose routes
  (e.g. the paginated `/posts` list) stay outside the group.
- `src/routes/posts/+page.svelte` (+ a load function) — paginated post list, sorted by
  `date` descending. Pagination is a `?page=` query param sliced against an in-memory
  array of posts at build/load time. No pagination library, no DB query — this is
  intentionally the simplest thing that works at personal-blog scale.
- `src/routes/posts/[slug]/+page.svelte` — individual post, statically generated from
  `content/posts/<slug>/index.svx`.

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
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.ts               # redirects (307) to /home
│       ├── layout.css
│       ├── (prose)/                # shared `prose` wrapper layout
│       │   ├── +layout.svelte
│       │   ├── home/+page.svx
│       │   ├── contact/+page.svx
│       │   └── projects/+page.svx
│       └── posts/
│           ├── +page.svelte       # paginated list (?page=)
│           └── [slug]/
│               └── +page.svelte   # individual post
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
