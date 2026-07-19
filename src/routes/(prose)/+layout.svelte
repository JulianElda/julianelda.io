<script lang="ts">
  let { children } = $props();
</script>

<div
  class="mx-auto prose text-xl dark:prose-invert prose-headings:font-heading">
  {@render children()}
</div>
