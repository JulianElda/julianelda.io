<script lang="ts">
  import type { Theme } from "$lib/theme/theme.types";

  import { toggleTheme } from "$lib/theme/theme.utils";
  import { onMount } from "svelte";

  let theme = $state<Theme>("light");
  let isDark = $derived(theme === "dark");

  // The component renders on the server without knowing the theme, so the
  // pressed state is read from <html> (set by app.html's bootstrap) on mount.
  onMount(() => {
    theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  function handleClick() {
    theme = toggleTheme();
  }
</script>

<button
  aria-label="Darkroom theme"
  aria-pressed={isDark}
  class="fixed top-0 right-0 z-20 size-13 cursor-pointer transition-[width,height] duration-200 ease-in-out hover:size-20 focus-visible:size-20 focus-visible:-outline-offset-8"
  onclick={handleClick}
  title={isDark ? "Turn back to paper" : "Turn to the darkroom"}
  type="button">
  <svg
    aria-hidden="true"
    class="block size-full overflow-visible"
    preserveAspectRatio="none"
    viewBox="0 0 100 100">
    <polygon
      class="fill-paper-other"
      points="0,0 100,0 100,100" />
    <polygon
      class="fill-flap drop-shadow-[-2px_3px_3px_rgba(0,0,0,0.22)]"
      points="0,0 100,100 0,100" />
    <line
      class="stroke-rule"
      stroke-width="1"
      vector-effect="non-scaling-stroke"
      x1="0"
      x2="100"
      y1="0"
      y2="100" />
  </svg>
</button>
