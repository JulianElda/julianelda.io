<script lang="ts">
  import type { Theme } from "$lib/theme/theme.types";

  import { toggleTheme } from "$lib/theme/theme.utils";
  import { flushSync, onDestroy, onMount } from "svelte";

  const TURN_MS = 560;
  const TURN_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
  // A top-right square this big puts its diagonal through the viewport's
  // bottom-left corner, so the turned corner covers the whole screen.
  const TURNED_SIZE = "calc(100vw + 100vh)";

  let theme = $state<Theme>("light");
  let isDark = $derived(theme === "dark");
  let isTurning = $state(false);
  let isSettling = $state(false);
  // The flap and its fold are the back of the sheet being turned, so they
  // keep the old theme's colours after the theme flips underneath them.
  let pinnedFlap = $state<string>();
  let pinnedFold = $state<string>();

  let settleFrame: number | undefined;

  // The component renders on the server without knowing the theme, so the
  // pressed state is read from <html> (set by app.html's bootstrap) on mount.
  onMount(() => {
    theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  onDestroy(() => {
    if (settleFrame !== undefined) {
      cancelAnimationFrame(settleFrame);
    }
  });

  // Cuts a top-right square of the given size out of the old page's snapshot,
  // 1px short so the old page overlaps the flap's edges instead of leaving an
  // antialiased seam where the new page shows through.
  function cutCorner(cornerSize: string) {
    const size = `calc(${cornerSize} - 1px)`;
    return `polygon(0 0, calc(100% - ${size}) 0, calc(100% - ${size}) ${size}, 100% ${size}, 100% 100%, 0 100%)`;
  }

  function handleClick(
    event: MouseEvent & { currentTarget: HTMLButtonElement },
  ) {
    if (isTurning) {
      return;
    }
    if (
      !("startViewTransition" in document) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      theme = toggleTheme();
      return;
    }

    const button = event.currentTarget;
    const root = document.documentElement;
    const from = `${button.getBoundingClientRect().width}px`;
    const style = getComputedStyle(button);
    const flap = style.getPropertyValue("--flap");
    const fold = style.getPropertyValue("--fold");

    root.dataset.themeTurn = "";
    const transition = document.startViewTransition(() => {
      theme = toggleTheme();
      isTurning = true;
      pinnedFlap = flap;
      pinnedFold = fold;
      flushSync();
    });

    let grow: Animation | undefined;
    transition.ready
      .then(() => {
        const timing = {
          duration: TURN_MS,
          easing: TURN_EASING,
          fill: "forwards",
        } as const;
        root.animate(
          { clipPath: [cutCorner(from), cutCorner(TURNED_SIZE)] },
          { ...timing, pseudoElement: "::view-transition-old(root)" },
        );
        grow = button.animate(
          {
            height: [from, TURNED_SIZE],
            width: [from, TURNED_SIZE],
          },
          timing,
        );
      })
      // A skipped transition (e.g. a hidden tab) still runs the update.
      .catch(() => {});

    void transition.finished.finally(() => {
      delete root.dataset.themeTurn;
      isTurning = false;
      pinnedFlap = undefined;
      pinnedFold = undefined;
      // Two frames with transitions off, so the corner snaps back to its
      // resting size instead of shrinking over the new theme.
      isSettling = true;
      flushSync();
      grow?.cancel();
      settleFrame = requestAnimationFrame(() => {
        settleFrame = requestAnimationFrame(() => {
          isSettling = false;
        });
      });
    });
  }
</script>

<button
  aria-label="Blackboard theme"
  aria-pressed={isDark}
  class="theme-corner fixed top-0 right-0 z-20 cursor-pointer focus-visible:-outline-offset-8"
  data-settle={isSettling || undefined}
  data-turning={isTurning || undefined}
  onclick={handleClick}
  style:--flap={pinnedFlap}
  style:--fold={pinnedFold}
  title={isDark ? "Turn back to paper" : "Turn to the blackboard"}
  type="button">
  <svg
    aria-hidden="true"
    class="theme-corner-under absolute inset-0 block size-full"
    preserveAspectRatio="none"
    viewBox="0 0 100 100">
    <polygon
      class="fill-paper-other"
      points="0,0 100,0 100,100" />
  </svg>
  <span
    aria-hidden="true"
    class="theme-corner-icon pointer-events-none absolute top-[11px] right-[11px] flex size-[22px] text-flap">
    <svg
      class="size-full"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
      viewBox="0 0 24 24">
      {#if isDark}
        <circle
          cx="12"
          cy="12"
          r="4" />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      {:else}
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      {/if}
    </svg>
  </span>
  <span
    aria-hidden="true"
    class="theme-corner-shadow pointer-events-none absolute inset-0 blur-[2.5px]">
    <span
      class="absolute inset-0 bg-black [clip-path:polygon(0_0,100%_100%,0_100%)]"
    ></span>
  </span>
  <span
    aria-hidden="true"
    class="theme-corner-flap pointer-events-none absolute inset-0 [clip-path:polygon(0_0,100%_100%,0_100%)]"
  ></span>
  <svg
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 block size-full"
    preserveAspectRatio="none"
    viewBox="0 0 100 100">
    <line
      class="stroke-fold"
      stroke-width="1"
      vector-effect="non-scaling-stroke"
      x1="0"
      x2="100"
      y1="0"
      y2="100" />
  </svg>
</button>
