// The slice of a hast node that rehypeExternalLinks reads and writes.
export interface HastNode {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
}

const EXTERNAL_HREF = /^https?:\/\//;

// A rehype plugin for mdsvex: links to other sites in post bodies open in a
// new tab, like the external links in the site's own components.
export function rehypeExternalLinks() {
  return (tree: HastNode) => {
    markExternalLinks(tree);
  };
}

function markExternalLinks(node: HastNode) {
  const href = node.properties?.href;
  if (
    node.type === "element" &&
    node.tagName === "a" &&
    typeof href === "string" &&
    EXTERNAL_HREF.test(href)
  ) {
    node.properties = {
      ...node.properties,
      rel: ["noopener", "noreferrer"],
      target: "_blank",
    };
  }
  for (const child of node.children ?? []) {
    markExternalLinks(child);
  }
}
