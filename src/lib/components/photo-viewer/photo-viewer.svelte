<script lang="ts">
  import type { PhotoWithImage } from "$lib/photos.types";

  import { formatExposure, formatGear } from "$lib/photos.utils";

  interface PhotoViewerProps {
    onclose: () => void;
    /** The photo to show; undefined closes the viewer. */
    photo: PhotoWithImage | undefined;
  }

  const { onclose, photo }: PhotoViewerProps = $props();

  let dialog: HTMLDialogElement | undefined = $state();

  let gear = $derived(photo?.meta ? formatGear(photo.meta) : undefined);
  let exposure = $derived(photo?.meta ? formatExposure(photo.meta) : undefined);

  // Fits the screen less 24px of backdrop on each side, the 16px frame, and the
  // caption strip, which grows by a line for each metadata row. Never wider
  // than the file itself, so a small old photo is not blown up into blur.
  let width = $derived.by(() => {
    if (!photo) {
      return;
    }
    const { h, w } = photo.image.img;
    const strip = 64 + (gear ? 24 : 0) + (exposure ? 24 : 0);
    return `min(${w}px, calc(100vw - 80px), calc((100vh - ${64 + strip}px) * ${w / h}))`;
  });

  // showModal() puts the dialog in the top layer: focus moves in, the page
  // behind goes inert, and Escape closes it. Focus returns to the print after.
  $effect(() => {
    if (photo && !dialog?.open) {
      dialog?.showModal();
    } else if (!photo && dialog?.open) {
      dialog.close();
    }
  });

  function handleClick(event: MouseEvent) {
    // The dialog fills the screen, so a click on it and not on the print is a
    // click on the backdrop.
    if (event.target === dialog) {
      dialog.close();
    }
  }
</script>

<!-- The backdrop click is for pointers; Escape closes it natively. -->
<dialog
  bind:this={dialog}
  aria-label={photo?.caption}
  class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center bg-transparent p-6 backdrop:bg-overlay open:flex"
  onclick={handleClick}
  {onclose}>
  {#if photo}
    <button
      aria-label="Close"
      class="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-overlay-button text-white"
      onclick={() => dialog?.close()}
      type="button">
      <svg
        aria-hidden="true"
        fill="none"
        height="20"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="20">
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </svg>
    </button>
    <figure class="bg-print px-4 pt-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <enhanced:img
        alt={photo.alt}
        class="block h-auto bg-[#ddd]"
        sizes={width}
        src={photo.image}
        style="width: {width}" />
      <figcaption
        class="flex min-h-16 flex-col items-center justify-center gap-1.5 px-2 pt-3 pb-4 text-center text-print-caption">
        <span class="text-[18px] leading-[1.25] italic">{photo.caption}</span>
        {#if gear}
          <span class="font-mono text-[12.5px] leading-[1.4] text-print-meta"
            >{gear}</span>
        {/if}
        {#if exposure}
          <span class="font-mono text-[12.5px] leading-[1.4] text-print-meta"
            >{exposure}</span>
        {/if}
      </figcaption>
    </figure>
  {/if}
</dialog>
