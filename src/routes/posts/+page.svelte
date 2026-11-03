<script lang="ts">
  import LeaderRow from "$lib/components/leader-row/leader-row.svelte";
  import SectionHeading from "$lib/components/section-heading/section-heading.svelte";
  import { formatShortDate } from "$lib/date.utils";
  import { groupPostsByYear } from "$lib/posts.utils";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let years = $derived(groupPostsByYear(data.posts));
</script>

<svelte:head>
  <title>Julius Polar - Writing</title>
</svelte:head>

<main class="flex flex-col">
  <h1 class="sr-only">Writing</h1>
  <p class="mb-16 text-muted italic">
    Thoughts on development, written down as they come.
  </p>

  {#each years as group (group.year)}
    <section class="mb-14 flex flex-col">
      <SectionHeading
        class="mb-2"
        title={group.year}
        trailing={`${group.posts.length} ${group.posts.length === 1 ? "post" : "posts"}`} />
      {#each group.posts as post (post.slug)}
        <LeaderRow
          date={formatShortDate(post.date)}
          datetime={post.date}
          description={post.description}
          slug={post.slug}
          title={post.title} />
      {/each}
    </section>
  {/each}
</main>
