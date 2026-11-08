<script lang="ts">
  import type { Snippet } from "svelte";

  interface PhotoRowProps {
    /** Two or three <Photo>s, side by side from sm up, stacked below it. */
    children: Snippet;
  }

  const { children }: PhotoRowProps = $props();
</script>

<!-- Each <Photo> keeps its own width and margins; the row only lays them out,
     shrinking them to share the column when they do not fit at full size. -->
<div class="flex flex-col sm:flex-row sm:gap-x-[clamp(14px,4vw,28px)]">
  {@render children()}
</div>
