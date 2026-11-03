<script lang="ts">
  import LeaderRow from "$lib/components/leader-row/leader-row.svelte";
  import SectionHeading from "$lib/components/section-heading/section-heading.svelte";
  import { formatMediumDate } from "$lib/date.utils";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const linkClass =
    "decoration-dotted decoration-2 underline-offset-5 hover:underline focus-visible:underline";
  // Below 600px the labels are visually hidden and only the icons show.
  const contactClass =
    "group flex min-h-12 basis-full items-center gap-3.5 max-[600px]:min-w-11 max-[600px]:basis-auto";
  const contactLabelClass =
    "text-[21px] decoration-dotted decoration-2 underline-offset-5 group-hover:underline group-focus-visible:underline max-[600px]:sr-only";
</script>

<svelte:head>
  <title>Julius Polar - Home</title>
  <meta
    content="Julius Polar - Home"
    name="description" />
  <meta
    content="Julius Polar - Home"
    property="og:title" />
  <meta
    content="Julius Polar - Home"
    property="og:description" />
</svelte:head>

<main class="flex flex-col">
  <h1 class="sr-only">About</h1>
  <p class="mb-8">
    Front-end dev by trade, curious person by nature. I spend my days building
    for the web, and I like staying on top of new tools and tech trends by
    actually trying them out.
  </p>
  <p class="mb-16">
    I build my own projects in my free time, and occasionally I write down my
    thoughts about development.
  </p>

  <SectionHeading
    class="mb-4"
    title="Currently" />
  <dl
    class="grid grid-cols-[max-content_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2.5 text-[19px] leading-[1.4]">
    <dt>Working</dt>
    <dd class="text-note">
      on the front end at <a
        class={linkClass}
        href="https://www.snke.com/">Snke OS</a>
    </dd>
    <dt>Building</dt>
    <dd class="text-note">typos, a lint hook for coding agents</dd>
  </dl>

  <SectionHeading
    class="mt-16 mb-2"
    title="Recent writings" />
  {#each data.posts as post (post.slug)}
    <LeaderRow
      date={formatMediumDate(post.date)}
      datetime={post.date}
      slug={post.slug}
      title={post.title} />
  {/each}

  <SectionHeading
    class="mt-16 mb-2"
    title="Contact" />
  <div class="flex flex-wrap gap-x-3">
    <a
      class={contactClass}
      href="https://www.linkedin.com/in/julius-polar/">
      <svg
        aria-hidden="true"
        class="size-[26px] flex-none"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.6"
        viewBox="0 0 24 24">
        <rect
          height="18"
          rx="3"
          width="18"
          x="3"
          y="3" />
        <path d="M8 10.5v6.5" />
        <path d="M8 7.2v.1" />
        <path d="M12 17v-6.5" />
        <path d="M12 13.6c0-1.9 1.1-3.1 2.6-3.1 1.6 0 2.4 1 2.4 2.9V17" />
      </svg>
      <span class={contactLabelClass}>LinkedIn</span>
    </a>
    <a
      class={contactClass}
      href="https://github.com/JulianElda">
      <svg
        aria-hidden="true"
        class="size-[26px] flex-none"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.6"
        viewBox="0 0 24 24">
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
      <span class={contactLabelClass}>GitHub</span>
    </a>
  </div>
</main>
