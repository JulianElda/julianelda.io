<script lang="ts">
  import { resolve } from "$app/paths";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Julius Polar - Posts</title>
</svelte:head>

<div class="mx-auto max-w-xl">
  <ul class="space-y-2">
    {#each data.posts as post (post.slug)}
      <li>
        <a
          class="flex gap-4 decoration-dotted hover:underline"
          href={resolve("/(prose)/posts/[slug]", { slug: post.slug })}>
          <span class="text-gray-500">{post.date}</span>
          <span>{post.title}</span>
        </a>
      </li>
    {/each}
  </ul>
</div>
