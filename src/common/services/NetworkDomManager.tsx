import capitalize from 'lodash/capitalize';
import last from 'lodash/last';
import React, { FC } from 'react';
import { useParams } from 'react-router';
import {
  generatePath,
  matchPath,
  matchRoutes,
  Navigate,
  Outlet,
} from 'react-router-dom';

import { RouteConfigExtended } from '../../components/RouterTitle/RouteConfigExtended';
import {
  initializeNetwork,
  isNetworkExists,
  networksInitialized$,
  selectedNetwork,
  selectedNetwork$,
} from '../../gateway/common/network';
import { Network } from '../../network/common/Network';
import { useObservable } from '../hooks/useObservable';

const handleAfterNetworkChange = (
  routesConfig: RouteConfigExtended[],
  network: Network<any, any>,
): void => {
  const matches = matchRoutes(routesConfig, location.pathname) || [];
  const pathPattern = matches
    .filter((m) => m.route.path !== '/' && m.route.path !== '')
    .reduce((pattern, m) => `${pattern}/${m.route.path}`, '');

  location.pathname = generatePath(pathPattern, {
    ...last(matches)?.params,
    network: network.name,
  });
};

const init = (routesConfig: RouteConfigExtended[]): void => {
  const urlNetworkParameter = matchPath(
    { path: ':network', end: false },
    location.pathname,
  )?.params?.network;

  initializeNetwork({
    possibleName: urlNetworkParameter,
    afterNetworkChange: handleAfterNetworkChange.bind(null, routesConfig),
  });
};

const NetworkDomManagerOutlet: FC = () => {
  const { network } = useParams<{ network: string }>();
  const networkExists = isNetworkExists(network?.toLowerCase());

  return networkExists ? (
    <Outlet />
  ) : (
    <Navigate to={`/${selectedNetwork.name}`} />
  );
};

const useNetworkTitle = (): string | undefined => {
  const [selectedNetwork] = useObservable(selectedNetwork$, [], undefined);

  return selectedNetwork ? capitalize(selectedNetwork.name) : undefined;
};

const initialized$ = networksInitialized$;

export const NetworkDomManager = {
  init,
  Outlet: NetworkDomManagerOutlet,
  useNetworkTitle,
  initialized$,
};
