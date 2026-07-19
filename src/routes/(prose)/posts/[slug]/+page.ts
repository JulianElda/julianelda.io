import type { PostFrontmatter } from "$lib/posts.types";
import type { Component } from "svelte";

import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

const modules = import.meta.glob<{
  default: Component;
  metadata: PostFrontmatter;
}>("/content/posts/*/index.svx");

export const load: PageLoad = async ({ params }) => {
  const importPost = modules[`/content/posts/${params.slug}/index.svx`];
  if (!importPost) {
    error(404, "Post not found");
  }

  const post = await importPost();
  if (post.metadata.draft && !import.meta.env.DEV) {
    error(404, "Post not found");
  }

  return { component: post.default, metadata: post.metadata };
};
