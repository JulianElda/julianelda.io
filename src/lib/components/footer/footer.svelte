<script lang="ts">
  import type { FooterProps } from "./footer.types";

  import GithubButton from "../github-button/github-button.svelte";
  import ThemeToggle from "../theme-toggle/theme-toggle.svelte";

  const { link }: FooterProps = $props();
</script>

<footer
  class="flex w-full items-center bg-app-background-light p-2 dark:bg-app-background-dark">
  <div class="flex flex-1 items-center gap-1">
    <GithubButton {link} />
  </div>
  <ThemeToggle />
</footer>
