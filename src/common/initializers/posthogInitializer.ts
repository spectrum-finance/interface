import posthog from 'posthog-js';
import { first, map, of, zip } from 'rxjs';

import { applicationSettings$, Settings } from '../../context';
import { selectedNetwork$ } from '../../gateway/common/network';
import { selectedWallet$ as cardanoSelectedWallet$ } from '../../network/cardano/api/wallet/wallet';
import {
  CardanoSettings,
  settings$ as cardanoSettings$,
} from '../../network/cardano/settings/settings';
import { Network } from '../../network/common/Network';
import { Wallet } from '../../network/common/Wallet';
import { selectedWallet$ as ergoSelectedWallet$ } from '../../network/ergo/api/wallet/wallet';
import {
  ErgoSettings,
  settings$ as ergoSettings$,
} from '../../network/ergo/settings/settings';
import { isDevEnv } from '../../utils/envUtils';
import { AnalyticsLaunchData } from '../analytics/@types/launch';
import { Initializer } from './core';

const mapToLaunchData = ([
  selectedNetwork,
  ergoSelectedWallet,
  cardanoSelectedWallet,
  ergoSettings,
  cardanoSettings,
  applicationSettings,
]: [
  Network<any, any>,
  Wallet | undefined,
  Wallet | undefined,
  ErgoSettings,
  CardanoSettings,
  Settings,
]): AnalyticsLaunchData => ({
  network: selectedNetwork.name,
  locale: applicationSettings.lang,
  theme: applicationSettings.theme as any,
  ergo: {
    minerFee: ergoSettings.minerFee,
    slippage: ergoSettings.slippage,
    nitro: ergoSettings.nitro,
    wallet: ergoSelectedWallet?.name,
  },
  cardano: {
    slippage: cardanoSettings.slippage,
    nitro: cardanoSettings.nitro,
    wallet: cardanoSelectedWallet?.name,
  },
});

export const posthogInitializer: Initializer = () => {
  if (isDevEnv) {
    posthog.init('phc_W0I06T1ivqb8JfKzDJco6wkJDYuO71p71KjcNkkOelb', {
      api_host: 'https://posthog.spectrum.fi',
      loaded: () => {
        zip([
          selectedNetwork$,
          ergoSelectedWallet$,
          cardanoSelectedWallet$,
          ergoSettings$,
          cardanoSettings$,
          applicationSettings$,
        ])
          .pipe(first(), map(mapToLaunchData))
          .subscribe((launchData) => {
            console.log(launchData);
            // panalytics.firstLaunch();
            // panalytics.sessionLaunch();
          });
      },
    });
  }
  return of(true);
};
