import { filter, first } from 'rxjs';

import { RouteConfigExtended } from '../../components/RouterTitle/RouteConfigExtended';
import { NetworkDomManager } from '../services/NetworkDomManager';
import { Initializer } from './core';

export const networkDomInitializer: Initializer = (
  routesConfig: RouteConfigExtended[],
) => {
  NetworkDomManager.init(routesConfig);
  return NetworkDomManager.initialized$.pipe(filter(Boolean), first());
};
