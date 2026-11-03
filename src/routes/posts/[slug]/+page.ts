import type { PostFrontmatter } from "$lib/posts.types";
import type { Component } from "svelte";

import { getReadingMinutes } from "$lib/posts.utils";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

const modules = import.meta.glob<{
  default: Component;
  metadata: PostFrontmatter;
}>("/content/posts/*/index.svx");
const sources = import.meta.glob<string>("/content/posts/*/index.svx", {
  import: "default",
  query: "?raw",
});

export const load: PageLoad = async ({ params }) => {
  const path = `/content/posts/${params.slug}/index.svx`;
  const importPost = modules[path];
  const importSource = sources[path];
  if (!importPost || !importSource) {
    error(404, "Post not found");
  }

  const post = await importPost();
  if (post.metadata.draft && !import.meta.env.DEV) {
    error(404, "Post not found");
  }

  return {
    component: post.default,
    metadata: post.metadata,
    readingMinutes: getReadingMinutes(await importSource()),
  };
};
