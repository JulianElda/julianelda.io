<script lang="ts">
  import type { Theme } from "$lib/theme/theme.types";

  import { toggleTheme } from "$lib/theme/theme.utils";
  import { onDestroy, onMount } from "svelte";

  // Matches the 560ms page-turn sweep in layout.css's .theme-corner rules.
  const TURN_MS = 560;

  let theme = $state<Theme>("light");
  let isDark = $derived(theme === "dark");
  let isTurning = $state(false);
  let isSettling = $state(false);

  let turnTimer: ReturnType<typeof setTimeout> | undefined;
  let settleFrame: number | undefined;

  // The component renders on the server without knowing the theme, so the
  // pressed state is read from <html> (set by app.html's bootstrap) on mount.
  onMount(() => {
    theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  onDestroy(() => {
    clearTimeout(turnTimer);
    if (settleFrame !== undefined) {
      cancelAnimationFrame(settleFrame);
    }
  });

  function handleClick() {
    if (isTurning) {
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      theme = toggleTheme();
      return;
    }

    isTurning = true;
    turnTimer = setTimeout(() => {
      theme = toggleTheme();
      isTurning = false;
      // Two frames with transitions off, so the corner snaps back to its
      // resting size instead of shrinking over the new theme.
      isSettling = true;
      settleFrame = requestAnimationFrame(() => {
        settleFrame = requestAnimationFrame(() => {
          isSettling = false;
        });
      });
    }, TURN_MS);
  }
</script>

<button
  aria-label="Blackboard theme"
  aria-pressed={isDark}
  class="theme-corner fixed top-0 right-0 z-20 cursor-pointer focus-visible:-outline-offset-8"
  data-settle={isSettling || undefined}
  data-turning={isTurning || undefined}
  onclick={handleClick}
  title={isDark ? "Turn back to paper" : "Turn to the blackboard"}
  type="button">
  <svg
    aria-hidden="true"
    class="absolute inset-0 block size-full"
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
