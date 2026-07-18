<script lang="ts">
  import type { GithubButtonProps } from "./github-button.types";

  import GithubMark from "../icons/github-mark.svelte";

  const { link }: GithubButtonProps = $props();
</script>

<div class="flex">
  <a
    aria-label={link}
    class="size-8 rounded-md bg-icon-button-background-light p-1 text-app-text-dark dark:bg-icon-button-background-dark dark:text-app-text-light"
    href={link}
    rel="noreferrer external"
    target="_blank">
    <GithubMark class="size-6" />
  </a>
</div>
