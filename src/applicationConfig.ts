import { mkSubject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { DateTime } from 'luxon';

import { Dictionary } from './common/utils/Dictionary';

interface OperationRestriction {
  readonly asset: string;
  readonly restrictionEnd: DateTime;
  readonly operation: 'swap' | 'liquidity';
}

interface NetworkConfig {
  readonly explorerUrl: string;
  readonly networkUrl: string;
  readonly analyticUrl?: string;
  readonly metadataUrl: string;
  readonly faucet?: string;
  readonly lowBalanceGuide?: string;
}

interface ApplicationConfig {
  readonly networksSettings: Dictionary<NetworkConfig>;
  readonly social: {
    readonly twitter: string;
    readonly telegram: string;
    readonly discord: string;
    readonly medium: string;
    readonly reddit: string;
  };
  readonly support: {
    readonly discord: string;
    readonly telegram: string;
  };
  readonly applicationTick: number;
  readonly hiddenAssets: string[];
  readonly blacklistedPools: string[];
  readonly operationsRestrictions: OperationRestriction[];
  readonly requestRetryCount: number;
}

export const applicationConfig: ApplicationConfig = {
  requestRetryCount: 3,
  networksSettings: {
    cardano: {
      metadataUrl: 'https://meta.ergodex.io/metadata',
      networkUrl: 'https://testnet-api.quickblue.io/v1',
      explorerUrl: 'https://testnet.cardanoscan.io',
      faucet: 'https://faucet.ergodex.io/v1/',
      lowBalanceGuide: '',
    },
    ergo: {
      metadataUrl:
        'https://raw.githubusercontent.com/ergolabs/ergo-dex-asset-icons/master',
      networkUrl: 'https://api.ergoplatform.com',
      explorerUrl: 'https://explorer.ergoplatform.com',
      analyticUrl: 'https://api.ergodex.io/v1/',
      lowBalanceGuide:
        'https://docs.ergodex.io/docs/user-guides/quick-start#3-get-assets',
    },
  },
  social: {
    twitter: 'https://twitter.com/ErgoDex',
    telegram: 'https://t.me/ergodex_community',
    discord: 'https://discord.com/invite/6MFFG4Fn4Y',
    medium: 'https://ergodex.medium.com/',
    reddit: 'https://www.reddit.com/r/ergodex/',
  },
  support: {
    discord: 'https://discord.gg/Jya72kjDfq',
    telegram: 'https://t.me/ergodex_community',
  },
  applicationTick: 10 * 1000,
  hiddenAssets: ['ergoTestTokenA', 'ergoTestTokenB'],
  blacklistedPools: [
    'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6',
    '4e497db00769f6402580c351c092ec6ae0306f08575c7a9c719267c84049c840',
    '61a579c46d92f2718576fc9839a2a1983f172e889ec234af8504b5bbf10edd89',
    'e24d17f85ac406827b0436a648f3960d8965e677700949ff28ab0ca9a37dd50e',
    '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da',
    mkSubject({
      policyId: '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da',
      name: '321ergoTestNFT321',
    }),
  ],
  operationsRestrictions: [
    {
      asset: 'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413',
      restrictionEnd: DateTime.utc(2022, 2, 2, 19, 0, 0),
      operation: 'swap',
    },
  ],
};
