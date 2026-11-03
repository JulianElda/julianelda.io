import { expect, test } from "vitest";

import type { PostFrontmatter } from "./posts.types";

import { getReadingMinutes, groupPostsByYear } from "./posts.utils";

function post(slug: string, date: string): PostFrontmatter {
  return { date, description: "", draft: false, slug, title: slug };
}

test("groupPostsByYear puts newer years first", () => {
  const groups = groupPostsByYear([
    post("old", "2025-02-09"),
    post("new", "2026-07-19"),
  ]);

  expect(groups.map((group) => group.year)).toStrictEqual(["2026", "2025"]);
});

test("groupPostsByYear keeps date order within a year", () => {
  const groups = groupPostsByYear([
    post("tech-stack", "2026-07-19"),
    post("spring", "2025-05-18"),
    post("fail-fast", "2026-07-26"),
    post("autumn", "2025-11-14"),
  ]);

  expect(groups[0]?.posts.map((p) => p.slug)).toStrictEqual([
    "fail-fast",
    "tech-stack",
  ]);
  expect(groups[1]?.posts.map((p) => p.slug)).toStrictEqual([
    "autumn",
    "spring",
  ]);
});

test("groupPostsByYear counts the posts in each year", () => {
  const groups = groupPostsByYear([
    post("a", "2026-07-26"),
    post("b", "2026-07-19"),
    post("c", "2025-11-14"),
    post("d", "2025-09-02"),
    post("e", "2025-05-18"),
  ]);

  expect(groups.map((group) => group.posts.length)).toStrictEqual([2, 3]);
});

test("getReadingMinutes ignores the frontmatter", () => {
  const frontmatter = `---\ntitle: ${"word ".repeat(300)}\n---\n`;

  expect(getReadingMinutes(`${frontmatter}${"word ".repeat(50)}`)).toBe(1);
});

test("getReadingMinutes gives 1 minute for a 50-word body", () => {
  expect(getReadingMinutes("word ".repeat(50))).toBe(1);
});

test("getReadingMinutes gives 3 minutes for a 401-word body", () => {
  expect(getReadingMinutes("word ".repeat(401))).toBe(3);
});
