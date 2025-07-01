"use client";

import { Card as CardLib } from "@julianelda/scratchpad";

interface CardProps {
  children: React.ReactNode;
}

export function Card(props: CardProps) {
  return <CardLib>{props.children}</CardLib>;
}
