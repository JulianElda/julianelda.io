<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
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

<h1>{data.metadata.title}</h1>
<data.component />
