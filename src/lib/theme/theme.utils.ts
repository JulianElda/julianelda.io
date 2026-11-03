import type { Theme } from "./theme.types";

import { THEME_COOKIE_MAX_AGE, THEME_COOKIE_NAME } from "./theme.constants";

export function toggleTheme(): Theme {
  const root = document.documentElement;
  const theme = root.dataset.theme === "dark" ? "light" : "dark";

  root.dataset.theme = theme;
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;

  return theme;
}
