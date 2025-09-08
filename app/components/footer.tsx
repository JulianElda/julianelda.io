"use client";

import { Footer as FooterLib } from "@julianelda/scratchpad";

export function Footer() {
  return (
    <div
      className={`
        fixed inset-x-0 bottom-0 z-20 mx-auto max-w-xl
      `}>
      <FooterLib link="https://github.com/JulianElda/julianelda.io" />
    </div>
  );
}
