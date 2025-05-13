"use client";

import { Hyperlink } from "@julianelda/scratchpad";

export default function Link({ title, href }: { title: string; href: string }) {
  return (
    <Hyperlink
      title={title}
      href={href}
    />
  );
}
