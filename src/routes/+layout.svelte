<script lang="ts">
  import { page } from "$app/state";
  import appleTouchIcon from "$lib/assets/apple-touch-icon.png";
  import favicon from "$lib/assets/favicon.ico";
  import faviconSvg from "$lib/assets/favicon.svg";
  import Footer from "$lib/components/footer/footer.svelte";
  import Header from "$lib/components/header/header.svelte";
  import { SITE_URL } from "$lib/site.constants";

  import "./layout.css";

  let { children } = $props();

  let canonicalUrl = $derived(`${SITE_URL}${page.url.pathname}`);
</script>

<svelte:head>
  <link
    href={favicon}
    rel="icon"
    sizes="any" />
  <link
    href={faviconSvg}
    rel="icon"
    type="image/svg+xml" />
  <link
    href={appleTouchIcon}
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

<div class="mx-auto max-w-xl md:pb-16">
  <Header />
  {@render children()}
</div>

<div class="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-xl">
  <Footer link="https://github.com/JulianElda/julianelda.io" />
</div>
