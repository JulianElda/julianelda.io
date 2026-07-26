import type { Handle } from "@sveltejs/kit";

import { THEME_COOKIE_NAME } from "$lib/theme/theme.constants";
import * as Sentry from "@sentry/sveltekit";
import { sequence } from "@sveltejs/kit/hooks";

export const handle: Handle = sequence(
  Sentry.sentryHandle(),
  async ({ event, resolve }) => {
    const theme =
      event.cookies.get(THEME_COOKIE_NAME) === "dark" ? "dark" : "light";

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace("%theme%", theme),
    });
  },
);
export const handleError = Sentry.handleErrorWithSentry();
