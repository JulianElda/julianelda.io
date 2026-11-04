<script lang="ts">
  import type { PhotoWithImage } from "$lib/photos.types";

  interface PhotoPrintProps {
    onopen: () => void;
    photo: PhotoWithImage;
    /** The print's rendered width, so the browser picks a fitting image. */
    sizes: string;
  }

  const { onopen, photo, sizes }: PhotoPrintProps = $props();
</script>

<button
  aria-label={`Open photo: ${photo.caption}`}
  class="block w-full cursor-zoom-in text-left"
  onclick={onopen}
  type="button">
  <figure
    class="bg-print px-[6%] pt-[6%] shadow-[0_1px_2px_rgba(0,0,0,0.14),0_6px_14px_rgba(0,0,0,0.08)]">
    <enhanced:img
      alt={photo.alt}
      class="block h-auto w-full bg-[#ddd]"
      loading="lazy"
      {sizes}
      src={photo.image} />
    <figcaption
      class="flex min-h-[3.2em] items-center justify-center px-[2%] pt-[6%] pb-[9%] text-center text-[15px] leading-[1.25] text-print-caption italic">
      {photo.caption}
    </figcaption>
  </figure>
</button>
