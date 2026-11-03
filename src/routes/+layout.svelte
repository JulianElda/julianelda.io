<script lang="ts">
  import { page } from "$app/state";
  import SiteHeader from "$lib/components/site-header/site-header.svelte";
  import ThemeCorner from "$lib/components/theme-corner/theme-corner.svelte";
  import { SITE_URL } from "$lib/site.constants";

  import "./layout.css";

  let { children } = $props();

  let canonicalUrl = $derived(`${SITE_URL}${page.url.pathname}`);
</script>

<svelte:head>
  <link
    href="/favicon.ico"
    rel="icon"
    sizes="any" />
  <link
    href="/favicon.svg"
    rel="icon"
    type="image/svg+xml" />
  <link
    href="/apple-touch-icon.png"
    rel="apple-touch-icon" />
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

<ThemeCorner />
<SiteHeader />
<div
  class="mx-auto max-w-[720px] px-5 pt-[calc(clamp(56px,10vh,112px)-16px)] pb-14">
  {@render children()}
</div>
