<script lang="ts">
  import PhotoPrint from "$lib/components/photo-print/photo-print.svelte";
  import PhotoViewer from "$lib/components/photo-viewer/photo-viewer.svelte";
  import { PHOTOS } from "$lib/photos.constants";

  let openSlug: string | undefined = $state();
  let openPhoto = $derived(PHOTOS.find((photo) => photo.slug === openSlug));
</script>

<svelte:head>
  <title>Julius Polar - Photos</title>
  <meta
    content="Julius Polar - Photos"
    name="description" />
  <meta
    content="Julius Polar - Photos"
    property="og:title" />
  <meta
    content="Julius Polar - Photos"
    property="og:description" />
</svelte:head>

<main class="flex flex-col">
  <h1 class="sr-only">Photos</h1>
  <p class="mb-14 text-muted italic">Photos I'm proud of.</p>

  <!-- Columns, not a grid: prints keep their own aspect ratio and stack like a
       masonry wall, at least 136px wide and at most three across. -->
  <div class="columns-[136px_3] gap-x-[clamp(14px,4vw,28px)]">
    {#each PHOTOS as photo (photo.slug)}
      <div class="mb-[clamp(14px,4vw,28px)] break-inside-avoid">
        <PhotoPrint
          captionOnHover
          onopen={() => (openSlug = photo.slug)}
          {photo}
          sizes="(min-width: 720px) 208px, 45vw" />
      </div>
    {/each}
  </div>
</main>

<PhotoViewer
  onclose={() => (openSlug = undefined)}
  photo={openPhoto} />
