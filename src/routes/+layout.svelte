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

<!-- Chalk filters, at the design's wear of 50: #chalk wears the edges of
     headings (.chalk), #smear grains the blackboard's nav highlighter. -->
<svg
  aria-hidden="true"
  class="absolute size-0 overflow-hidden">
  <filter
    id="chalk"
    color-interpolation-filters="sRGB"
    height="120%"
    width="108%"
    x="-4%"
    y="-10%">
    <feTurbulence
      baseFrequency="1.15"
      numOctaves="2"
      result="noise"
      seed="7"
      type="fractalNoise" />
    <feDisplacementMap
      in="SourceGraphic"
      in2="noise"
      result="rough"
      scale="1.1"
      xChannelSelector="R"
      yChannelSelector="G" />
    <feColorMatrix
      in="noise"
      result="mask"
      type="matrix"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 0 0 0 -0.6" />
    <feComposite
      in="rough"
      in2="mask"
      operator="in" />
  </filter>
  <filter
    id="smear"
    color-interpolation-filters="sRGB"
    height="140%"
    width="104%"
    x="-2%"
    y="-20%">
    <feTurbulence
      baseFrequency="0.85"
      numOctaves="2"
      result="grain"
      seed="3"
      type="fractalNoise" />
    <feTurbulence
      baseFrequency="0.015 0.45"
      numOctaves="2"
      result="streak"
      seed="11"
      type="fractalNoise" />
    <feColorMatrix
      in="grain"
      result="g"
      type="matrix"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -2" />
    <feColorMatrix
      in="streak"
      result="s"
      type="matrix"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -0.8" />
    <feComposite
      in="g"
      in2="s"
      operator="in"
      result="m" />
    <feDisplacementMap
      in="SourceGraphic"
      in2="grain"
      result="rough"
      scale="3"
      xChannelSelector="R"
      yChannelSelector="G" />
    <feComposite
      in="rough"
      in2="m"
      operator="in" />
  </filter>
</svg>
<ThemeCorner />
<SiteHeader />
<div
  class="mx-auto max-w-[720px] px-5 pt-[calc(clamp(56px,10vh,112px)-16px)] pb-14">
  {@render children()}
</div>
