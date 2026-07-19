import type { PostFrontmatter } from "$lib/posts.types";

const modules = import.meta.glob<{ metadata: PostFrontmatter }>(
  "/content/posts/*/index.svx",
  { eager: true },
);

export function getPosts(): PostFrontmatter[] {
  const posts = Object.values(modules).map((mod) => mod.metadata);
  const visible = import.meta.env.DEV
    ? posts
    : posts.filter((post) => !post.draft);
  return visible.toSorted((a, b) => (a.date < b.date ? 1 : -1));
}
