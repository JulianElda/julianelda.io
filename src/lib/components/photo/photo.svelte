<script lang="ts">
  import PhotoPrint from "$lib/components/photo-print/photo-print.svelte";
  import PhotoViewer from "$lib/components/photo-viewer/photo-viewer.svelte";
  import { PHOTOS } from "$lib/photos.constants";

  interface PhotoProps {
    /** A slug from content/photos/photos.json. */
    slug: string;
  }

  const { slug }: PhotoProps = $props();

  // Posts borrow from /photos, never the other way round: a post's own images
  // stay in its folder and never show up on the photos page.
  let photo = $derived.by(() => {
    const found = PHOTOS.find((candidate) => candidate.slug === slug);
    if (!found) {
      throw new Error(
        `<Photo slug="${slug}">: not in content/photos/photos.json`,
      );
    }
    return found;
  });
  let isOpen = $state(false);
</script>

<div class="mx-auto mt-2 mb-10 w-[min(300px,80%)]">
  <PhotoPrint
    captionOnHover
    onopen={() => (isOpen = true)}
    {photo}
    sizes="300px" />
</div>
<PhotoViewer
  onclose={() => (isOpen = false)}
  photo={isOpen ? photo : undefined} />
