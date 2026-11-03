<script lang="ts">
  import { resolve } from "$app/paths";
  import { formatDate } from "$lib/date.utils";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let updated = $derived(
    data.metadata.updated && data.metadata.updated !== data.metadata.date
      ? data.metadata.updated
      : undefined,
  );
</script>

<svelte:head>
  <title>{data.metadata.title} - Julius Polar</title>
  <meta
    content={data.metadata.description}
    name="description" />
  <meta
    content={data.metadata.title}
    property="og:title" />
  <meta
    content={data.metadata.description}
    property="og:description" />
</svelte:head>

<!-- Posts sit closer to the header than other pages: half of
     clamp(48px, 9vh, 96px) instead of half of the layout's
     clamp(56px, 10vh, 112px), and 72px below. -->
<article
  class="-mt-[calc((clamp(56px,10vh,112px)-clamp(48px,9vh,96px))/2)] flex flex-col pb-4">
  <p class="mb-3 text-[17px] leading-normal text-muted italic">
    <time datetime={data.metadata.date}>{formatDate(data.metadata.date)}</time>
    · {data.readingMinutes} min read
    {#if updated}
      · Updated <time datetime={updated}>{formatDate(updated)}</time>
    {/if}
  </p>
  <h1 class="chalk mb-4 text-[clamp(36px,7vw,48px)] leading-[1.1]">
    {data.metadata.title}
  </h1>
  <p class="mb-12 text-muted italic">{data.metadata.description}</p>

  <div class="post-body">
    <data.component />
  </div>

  <a
    class="mt-6 inline-flex min-h-11 items-center self-start text-[18px] italic decoration-dotted decoration-2 underline-offset-5 hover:underline focus-visible:underline"
    href={resolve("/posts")}>← All writing</a>
</article>
