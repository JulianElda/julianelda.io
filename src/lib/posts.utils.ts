import type { PostFrontmatter, PostYearGroup } from "./posts.types";

const WORDS_PER_MINUTE = 200;
const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

/** Reading time in whole minutes for a post's raw `.svx` source, frontmatter excluded. */
export function getReadingMinutes(source: string): number {
  const body = source.replace(FRONTMATTER_PATTERN, "");
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Groups posts by the year of their `date`, newest year and newest post first. */
export function groupPostsByYear(posts: PostFrontmatter[]): PostYearGroup[] {
  const groups: PostYearGroup[] = [];
  const sorted = posts.toSorted((a, b) => (a.date < b.date ? 1 : -1));

  for (const post of sorted) {
    const year = post.date.slice(0, 4);
    const group = groups.at(-1);
    if (group?.year === year) {
      group.posts.push(post);
    } else {
      groups.push({ posts: [post], year });
    }
  }

  return groups;
}
