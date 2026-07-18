<script lang="ts">
  import { page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import { SITE_URL } from "$lib/site.constants";

  import "./layout.css";

  let { children } = $props();

  let canonicalUrl = $derived(`${SITE_URL}${page.url.pathname}`);
</script>

<svelte:head>
  <link
    href={favicon}
    rel="icon" />
  <link
    href={canonicalUrl}
    rel="canonical" />
  <meta
    content="website"
    property="og:type" />
  <meta
    content={canonicalUrl}
    property="og:url" />
</svelte:head>

<div class="mx-auto max-w-xl text-xl md:pb-16">
  {@render children()}
</div>
