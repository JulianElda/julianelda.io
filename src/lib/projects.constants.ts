import type { Project } from "./projects.types";

export const PROJECTS: Project[] = [
  {
    description:
      "A PostToolUse hook for Claude Code (or GitHub Copilot) that lints and formats a single edited file without touching git.",
    href: "https://github.com/JulianElda/arche/tree/master/packages/typos",
    linkLabel: "on GitHub ↗",
    name: "typos",
    notes: [
      "reuses the repo’s existing .nano-staged.json config",
      "safe under concurrent agent calls",
      "returns failures as blocking feedback, so the agent sees the error and self-corrects",
    ],
    wide: true,
  },
  {
    description: "Tools and converters.",
    href: "https://meter.julianelda.io/",
    linkLabel: "meter.julianelda.io ↗",
    name: "meter",
    notes: [
      "units: time, weight, volume",
      "generators: passwords, GUIDs, lorem ipsum",
    ],
  },
  {
    description: "Shows the weather at your current location.",
    href: "https://kairos.julianelda.io/",
    linkLabel: "kairos.julianelda.io ↗",
    name: "kairos",
    notes: [],
  },
  {
    description: "A theorycrafting tool for Final Fantasy XIV’s Black Mage.",
    href: "https://f4.julianelda.io/",
    linkLabel: "f4.julianelda.io ↗",
    name: "f4",
    notes: ["compare a rotation against the standard one", "for patch 6.x"],
  },
  {
    description: "My homepage, the notebook you’re reading now.",
    href: "https://github.com/JulianElda/julianelda.io",
    linkLabel: "on GitHub ↗",
    name: "julianelda.io",
    notes: [],
  },
];
