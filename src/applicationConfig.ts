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

interface CardanoUpdate {
  readonly title: string;
  readonly content: string;
}

interface ApplicationConfig {
  readonly cardanoMaintenance: boolean;
  readonly cardanoUpdate?: CardanoUpdate;
  readonly reCaptchaKey: string;
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
  cardanoMaintenance: true,
  cardanoUpdate: {
    title: 'Under Maintenance',
    content: 'We are migrating the protocol to Vasil Hard Fork testnet.',
  },
  reCaptchaKey: '6LeUJ8YfAAAAAMYIqGvtOmJGLeJtCSv6FBH_5sA3',
  requestRetryCount: 3,
  networksSettings: {
    cardano: {
      metadataUrl: 'https://testnet-meta.ergodex.io/metadata',
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
    discord: 'https://discord.gg/zY2gmTYQVD',
    medium: 'https://ergodex.medium.com/',
    reddit: 'https://www.reddit.com/r/ergodex/',
  },
  support: {
    discord: 'https://discord.gg/Jya72kjDfq',
    telegram: 'https://t.me/ergodex_community',
  },
  applicationTick: 10 * 1000,
  hiddenAssets: [
    'ef802b475c06189fdbf844153cdc1d449a5ba87cce13d11bb47b5a539f27f12b',
    '30974274078845f263b4f21787e33cc99e9ec19a17ad85a5bc6da2cca91c5a2e',
  ],
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
    mkSubject({
      name: 'C3t_MELDt_nft',
      policyId: '1d27e0100eb24fb797501b2692f160e7ba372f93b3527080774150b3',
    }),
    mkSubject({
      name: 'C3t_ADAt_nft',
      policyId: 'be2fc42476b6c8e60d5a3cf2b1c53158f88945929ebe3d3d88ad33e6',
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
