<script lang="ts">
  import ProjectCard from "$lib/components/project-card/project-card.svelte";
  import { PROJECTS } from "$lib/projects.constants";
</script>

<svelte:head>
  <title>Julius Polar - Projects</title>
  <meta
    content="Julius Polar - Projects"
    name="description" />
  <meta
    content="Julius Polar - Projects"
    property="og:title" />
  <meta
    content="Julius Polar - Projects"
    property="og:description" />
</svelte:head>

<main class="flex flex-col">
  <h1 class="sr-only">Projects</h1>
  <p class="mb-14 text-muted italic">Things I build in my free time.</p>

  <div
    class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-start gap-x-7 gap-y-11">
    {#each PROJECTS as project (project.name)}
      <ProjectCard {project} />
    {/each}
  </div>
</main>
