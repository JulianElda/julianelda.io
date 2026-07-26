<script lang="ts">
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

<h1 class="mb-2!">{data.metadata.title}</h1>
<p class="not-prose flex gap-4 text-sm text-gray-500">
  <span
    >Posted
    <time datetime={data.metadata.date}>{formatDate(data.metadata.date)}</time>
  </span>
  {#if updated}
    <span>Updated <time datetime={updated}>{formatDate(updated)}</time></span>
  {/if}
</p>
<data.component />
