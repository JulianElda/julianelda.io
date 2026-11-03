import { describe, expect, test } from "vitest";

import type { HastNode } from "./markdown.utils";

import { rehypeExternalLinks } from "./markdown.utils";

describe(rehypeExternalLinks, () => {
  test("opens links to other sites in a new tab", () => {
    const link: HastNode = {
      properties: { href: "https://svelte.dev/" },
      tagName: "a",
      type: "element",
    };
    const tree: HastNode = {
      children: [{ children: [link], tagName: "p", type: "element" }],
      type: "root",
    };

    rehypeExternalLinks()(tree);

    expect(link.properties).toStrictEqual({
      href: "https://svelte.dev/",
      rel: ["noopener", "noreferrer"],
      target: "_blank",
    });
  });

  test("leaves links within the site and anchors alone", () => {
    const internal: HastNode = {
      properties: { href: "/posts/my-tech-stack" },
      tagName: "a",
      type: "element",
    };
    const anchor: HastNode = {
      properties: { href: "#setup" },
      tagName: "a",
      type: "element",
    };
    const tree: HastNode = { children: [internal, anchor], type: "root" };

    rehypeExternalLinks()(tree);

    expect(internal.properties).toStrictEqual({ href: "/posts/my-tech-stack" });
    expect(anchor.properties).toStrictEqual({ href: "#setup" });
  });
});
