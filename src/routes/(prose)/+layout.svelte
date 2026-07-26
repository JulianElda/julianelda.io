<script lang="ts">
  let { children } = $props();
</script>

<main
  class="mx-auto prose text-xl dark:prose-invert prose-headings:font-heading">
  {@render children()}
</main>
