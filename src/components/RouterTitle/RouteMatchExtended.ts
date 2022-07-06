import { Location } from 'history';
import { RouteMatch } from 'react-router/lib/router';
import { matchRoutes as _matchRoutes } from 'react-router-dom';

import { RouteConfigExtended } from './RouteConfigExtended';

export interface RouteMatchExtended extends Omit<RouteMatch, 'route'> {
  readonly route: RouteConfigExtended;
}

export const matchRoutesExtended = (
  routes: RouteConfigExtended[],
  locationArg: Partial<Location> | string,
  basename?: string,
): RouteMatchExtended[] => _matchRoutes(routes, locationArg, basename) || [];
