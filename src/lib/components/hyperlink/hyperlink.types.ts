import type { Snippet } from "svelte";

export interface HyperlinkProps {
  asterisk?: boolean;
  children: Snippet;
  href: string;
}
