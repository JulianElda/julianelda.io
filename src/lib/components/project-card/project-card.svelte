<script lang="ts">
  import type { Project } from "$lib/projects.types";

  interface ProjectCardProps {
    project: Project;
  }

  const { project }: ProjectCardProps = $props();
</script>

<article
  class={[
    "mt-[17px] flex flex-col border-[1.5px] border-t-0 border-strong px-5 pb-3.5",
    project.wide && "col-span-full",
  ]}>
  <div class="-mx-5 -mt-[17px] mb-1.5 flex items-center">
    <span
      aria-hidden="true"
      class="h-[1.5px] flex-[0_0_14px] bg-strong"></span>
    <h2 class="chalk px-2.5 text-[26px] leading-[34px] text-accent">
      {project.name}
    </h2>
    <span
      aria-hidden="true"
      class="h-[1.5px] flex-auto bg-strong"></span>
  </div>
  <p class="mb-2.5 text-[18px] leading-normal">{project.description}</p>
  {#if project.notes.length > 0}
    <ul class="mb-2.5 flex flex-col gap-1 text-[17px] leading-[1.45] text-note">
      {#each project.notes as note (note)}
        <li class="flex gap-2.5"><span aria-hidden="true">–</span>{note}</li>
      {/each}
    </ul>
  {/if}
  <a
    class="flex min-h-11 items-center self-start text-[17px] text-strong italic decoration-dotted decoration-2 underline-offset-5 hover:underline focus-visible:underline"
    href={project.href}
    rel="external">{project.linkLabel}</a>
</article>
