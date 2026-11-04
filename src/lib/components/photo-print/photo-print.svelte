<script lang="ts">
  import type { PhotoWithImage } from "$lib/photos.types";

  interface PhotoPrintProps {
    /**
     * Shows the caption only on hover or keyboard focus. Its strip keeps its
     * height, so the wall of prints does not shift as it fades in.
     */
    captionOnHover?: boolean;
    onopen: () => void;
    photo: PhotoWithImage;
    /** The print's rendered width, so the browser picks a fitting image. */
    sizes: string;
  }

  const {
    captionOnHover = false,
    onopen,
    photo,
    sizes,
  }: PhotoPrintProps = $props();
</script>

<!-- The hovered print lifts above its neighbours, so its slight growth
     overlaps them instead of slipping under the next one in the column. -->
<button
  aria-label={`Open photo: ${photo.caption}`}
  class="group relative block w-full cursor-zoom-in text-left hover:z-10 focus-visible:z-10"
  onclick={onopen}
  type="button">
  <figure
    class="bg-print px-[6%] pt-[6%] shadow-[0_1px_2px_rgba(0,0,0,0.14),0_6px_14px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none">
    <enhanced:img
      alt={photo.alt}
      class="block h-auto w-full bg-[#ddd]"
      loading="lazy"
      {sizes}
      src={photo.image} />
    <figcaption
      class={[
        "flex min-h-[3.2em] items-center justify-center px-[2%] pt-[6%] pb-[9%] text-center text-[15px] leading-[1.25] text-print-caption italic",
        captionOnHover &&
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none",
      ]}>
      {photo.caption}
    </figcaption>
  </figure>
</button>
