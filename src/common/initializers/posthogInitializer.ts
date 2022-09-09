import posthog from 'posthog-js';
import { first, map, of, zip } from 'rxjs';

import { version } from '../../../package.json';
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
import { panalytics } from '../analytics';
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
  version,
  network: selectedNetwork.name,
  locale: applicationSettings.lang,
  theme: applicationSettings.theme,
  ergo_minerFee: ergoSettings.minerFee,
  ergo_slippage: ergoSettings.slippage,
  ergo_nitro: ergoSettings.nitro,
  ergo_wallet: ergoSelectedWallet?.name,
  cardano_slippage: cardanoSettings.slippage,
  cardano_nitro: cardanoSettings.nitro,
  cardano_wallet: cardanoSelectedWallet?.name,
});

const POSTHOG_API = 'https://anph.spectrum.fi';

export const posthogInitializer: Initializer = () => {
  if (process.env.REACT_APP_POSTHOG_API_KEY) {
    posthog.init(process.env.REACT_APP_POSTHOG_API_KEY, {
      api_host: POSTHOG_API,
      autocapture: false,
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
            panalytics.appLaunch(launchData);
          });
      },
    });
  }
  return of(true);
};
