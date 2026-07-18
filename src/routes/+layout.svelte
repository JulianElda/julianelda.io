<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  import "./layout.css";

  let { children } = $props();
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon} />
</svelte:head>

<div class="mx-auto max-w-xl text-xl md:pb-16">
  {@render children()}
</div>
