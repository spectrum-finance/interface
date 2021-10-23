export const isDarkOsTheme = (): boolean =>
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;
