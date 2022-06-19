import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { RouteConfigExtended } from './RouteConfigExtended';
import { matchRoutesExtended, RouteMatchExtended } from './RouteMatchExtended';

export interface RouterTitleProps {
  readonly pageTitle: string;
  readonly routesConfig: RouteConfigExtended[];
  readonly divider?: string;
}

const buildTitle = (
  pageTitle: string,
  divider: string,
  matches: RouteMatchExtended[],
): string =>
  matches
    .filter((m) => !!m.route.title)
    .reduce((title, m) => `${title} ${divider} ${m.route.title}`, pageTitle);

export const RouterTitle: FC<RouterTitleProps> = ({
  routesConfig,
  divider = '·',
  pageTitle,
}) => {
  const location = useLocation();

  useEffect(() => {
    document.title = buildTitle(
      pageTitle,
      divider,
      matchRoutesExtended(routesConfig, location),
    );
  }, [location, pageTitle]);

  return null;
};
