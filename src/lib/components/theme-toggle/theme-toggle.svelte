<script lang="ts">
  import { toggleTheme } from "$lib/theme/theme.utils";

  import ThemeMoon from "../icons/theme-moon.svelte";
  import ThemeSun from "../icons/theme-sun.svelte";
</script>

<button
  aria-label="Toggle theme"
  class="size-8 cursor-pointer rounded-md bg-icon-button-background-light p-1 text-app-text-dark dark:bg-icon-button-background-dark dark:text-app-text-light"
  onclick={toggleTheme}
  type="button">
  <ThemeMoon class="size-6 stroke-2 dark:hidden" />
  <ThemeSun class="hidden size-6 stroke-2 dark:block" />
</button>
