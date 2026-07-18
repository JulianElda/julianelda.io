<script lang="ts">
  import type { HyperlinkProps } from "./hyperlink.types";

  const { asterisk, children, href }: HyperlinkProps = $props();
</script>

<a
  class="text-primary-900 decoration-dotted hover:text-primary-700 hover:underline dark:text-primary-100 dark:hover:text-primary-300"
  {href}
  rel="noreferrer external"
  target="_blank">
  {@render children()}{asterisk === false ? "" : "*"}
</a>
