<script lang="ts">
  interface SectionHeadingProps {
    class?: string;
    title: string;
    trailing?: string;
  }

  const { class: className, title, trailing }: SectionHeadingProps = $props();
</script>

<div class={["flex items-center gap-3", className]}>
  <h2 class="chalk text-[26px] leading-[1.2] text-accent">{title}</h2>
  <span
    aria-hidden="true"
    class="h-px flex-auto bg-rule"></span>
  {#if trailing}
    <span class="text-base text-muted italic">{trailing}</span>
  {/if}
</div>
