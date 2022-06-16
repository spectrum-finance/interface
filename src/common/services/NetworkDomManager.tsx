import { last } from 'lodash';
import capitalize from 'lodash/capitalize';
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

const setFavicon = (n: Network<any, any>): void => {
  const link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (link) {
    link.href = n.favicon;
  }
};

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

  const selectedNetwork: Network<any, any> = initializeNetwork({
    possibleName: urlNetworkParameter,
    afterNetworkChange: handleAfterNetworkChange.bind(null, routesConfig),
  });
  setFavicon(selectedNetwork);
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
