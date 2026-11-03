<script lang="ts">
  import { resolve } from "$app/paths";

  interface LeaderRowProps {
    date: string;
    datetime: string;
    description?: string;
    slug: string;
    title: string;
  }

  const { date, datetime, description, slug, title }: LeaderRowProps = $props();
</script>

<a
  class={[
    "group flex flex-col gap-1",
    description ? "pt-3.5 pb-3" : "min-h-12 justify-center py-2",
  ]}
  href={resolve("/posts/[slug]", { slug })}>
  <span class="flex items-baseline gap-2.5 text-[21px]">
    <span
      class="decoration-dotted decoration-2 underline-offset-5 group-hover:underline group-focus-visible:underline"
      >{title}</span>
    <span
      aria-hidden="true"
      class="flex-[1_1_24px] -translate-y-1.5 border-b-2 border-dotted border-rule"
    ></span>
    <time
      class="text-[17px] whitespace-nowrap text-muted italic"
      {datetime}>{date}</time>
  </span>
  {#if description}
    <span class="text-[17px] leading-[1.45] text-note">{description}</span>
  {/if}
</a>
