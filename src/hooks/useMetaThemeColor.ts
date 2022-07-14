import { useEffect } from 'react';

export const useMetaThemeColor = <K extends string>(
  config: { [P in K]: string },
  theme: K,
): void => {
  useEffect(() => {
    document.documentElement
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', config[theme]);
  }, [theme]);
};
