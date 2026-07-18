import type { Handle } from "@sveltejs/kit";

import { THEME_COOKIE_NAME } from "$lib/theme/theme.constants";

export const handle: Handle = async ({ event, resolve }) => {
  const theme =
    event.cookies.get(THEME_COOKIE_NAME) === "dark" ? "dark" : "light";

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%theme%", theme),
  });
};
