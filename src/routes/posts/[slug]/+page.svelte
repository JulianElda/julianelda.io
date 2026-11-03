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

<article class="flex flex-col">
  <p class="mb-3 text-[17px] leading-normal text-muted italic">
    <time datetime={data.metadata.date}>{formatDate(data.metadata.date)}</time>
    · {data.readingMinutes} min read
    {#if updated}
      · Updated <time datetime={updated}>{formatDate(updated)}</time>
    {/if}
  </p>
  <h1 class="mb-4 text-[clamp(36px,7vw,48px)] leading-[1.1]">
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
