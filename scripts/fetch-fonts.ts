// Heliotrope is licensed from MB Type and may not be stored in a public
// repository, so src/lib/fonts/ is gitignored. Locally the files are copied in
// once from the licensed download; CI and Vercel fetch them from the private
// JulianElda/fonts repo with a read-only FONTS_TOKEN.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const FONTS_DIR = path.resolve(import.meta.dirname, "../src/lib/fonts");
const FONTS_REPO_URL =
  "https://api.github.com/repos/JulianElda/fonts/contents/heliotrope";
const FONT_FILES = [
  "heliotrope_3_regular.woff2",
  "heliotrope_3_italic.woff2",
  "heliotrope_3_bold.woff2",
  "heliotrope_3_bold_italic.woff2",
  "heliotrope_4_regular.woff2",
  "heliotrope_4_italic.woff2",
  "heliotrope_4_bold.woff2",
  "heliotrope_4_bold_italic.woff2",
];

async function downloadFont(file: string, token: string) {
  const response = await fetch(`${FONTS_REPO_URL}/${file}`, {
    headers: {
      Accept: "application/vnd.github.raw",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Downloading ${file} failed: ${response.status} ${response.statusText}`,
    );
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  writeFileSync(path.join(FONTS_DIR, file), bytes);
}

const missing = FONT_FILES.filter(
  (file) => !existsSync(path.join(FONTS_DIR, file)),
);

if (missing.length > 0) {
  const token = process.env.FONTS_TOKEN;
  if (!token) {
    console.error(
      [
        `Missing Heliotrope fonts in src/lib/fonts/: ${missing.join(", ")}`,
        "Either copy them in from the licensed MB Type download,",
        "or set FONTS_TOKEN to fetch them from JulianElda/fonts.",
      ].join("\n"),
    );
    process.exit(1);
  }

  mkdirSync(FONTS_DIR, { recursive: true });
  await Promise.all(missing.map((file) => downloadFont(file, token)));
  console.log(`Fetched ${missing.length} Heliotrope fonts into src/lib/fonts/`);
}
