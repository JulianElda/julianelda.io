"use client";

import { Hyperlink } from "@julianelda/scratchpad";

export function Link({ href, title }: { href: string; title: string }) {
  return (
    <Hyperlink
      href={href}
      title={title}
    />
  );
}
