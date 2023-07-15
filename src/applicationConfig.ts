import { mkSubject } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { DateTime } from 'luxon';

import { Dictionary } from './common/utils/Dictionary';
import { isProductionEnv } from './common/utils/env';

const isProductionHost = 'app.spectrum.fi' === location.host;

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
  readonly ergopayUrl?: string;
  readonly spfFaucet?: string;
  readonly faucet?: string;
  readonly lowBalanceGuide?: string;
  readonly defaultTokenListUrl: string;
  readonly isCreatePoolAvailable: boolean;
}

interface CardanoUpdate {
  readonly title: string;
  readonly content: string;
}

interface ApplicationConfig {
  readonly cookieDomain: string | undefined;
  readonly cardanoMaintenance: boolean;
  readonly cardanoUpdate?: CardanoUpdate;
  readonly operationTimeoutTime: number;
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
  readonly blacklistedHistoryAssets: string[];
  readonly farmsWhiteList: string[];
  readonly testFarms: string[];
  readonly operationsRestrictions: OperationRestriction[];
  readonly requestRetryCount: number;
  readonly cardanoAmmSwapsOpenTime: DateTime;
  readonly lbspLiquidityPools: string[];
}

export const applicationConfig: ApplicationConfig = {
  operationTimeoutTime: 60_000,
  cookieDomain: isProductionEnv() ? 'spectrum.fi' : undefined,
  cardanoMaintenance: false,
  // cardanoUpdate: {
  //   title: 'On the way to the mainnet',
  //   content: 'The Cardano AMM protocol will be available in mainnet soon',
  // },
  reCaptchaKey: '6LfCKZIiAAAAACypYW5pGlgZNTcwse1njmQMIUUL',
  requestRetryCount: 3,
  networksSettings: {
    cardano_preview: {
      defaultTokenListUrl: 'https://spectrum.fi/cardano-token-list.json',
      metadataUrl:
        'https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/cardano',
      networkUrl: 'https://explorer.spectrum.fi/cardano/preview/v1/',
      explorerUrl: 'https://preview.cexplorer.io',
      lowBalanceGuide: '',
      analyticUrl: 'https://test-api.spectrum.fi/cardano/v1/',
      isCreatePoolAvailable: false,
    },
    cardano_mainnet: {
      defaultTokenListUrl: 'https://spectrum.fi/cardano-token-list.json',
      metadataUrl:
        'https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/cardano',
      networkUrl: 'https://explorer.spectrum.fi/cardano/mainnet/v1/',
      explorerUrl: 'https://cexplorer.io',
      lowBalanceGuide: '',
      analyticUrl: 'https://test-api.spectrum.fi/cardano/v1/',
      isCreatePoolAvailable: false,
    },
    ergo: {
      defaultTokenListUrl: 'https://spectrum.fi/ergo-token-list.json',
      metadataUrl:
        'https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/ergo',
      spfFaucet: 'https://airdrop.spectrum.fi/v1/faucet/',
      networkUrl: 'https://api.ergoplatform.com',
      explorerUrl: 'https://explorer.ergoplatform.com',
      analyticUrl: 'https://api.spectrum.fi/v1/',
      lowBalanceGuide:
        'https://docs.spectrum.fi/docs/user-guides/quick-start#3-get-assets',
      ergopayUrl: 'https://ergopay-backend.fly.dev',
      isCreatePoolAvailable: true,
    },
  },
  social: {
    twitter: 'https://twitter.com/spectrumlabs_',
    telegram: 'https://t.me/spectrum_labs_community',
    discord: 'https://discord.com/invite/zY2gmTYQVD',
    medium: 'https://spectrumlabs.medium.com',
    reddit: 'https://www.reddit.com/r/SpectrumLabs/',
  },
  support: {
    discord: 'https://discord.com/invite/zY2gmTYQVD',
    telegram: 'https://t.me/spectrum_labs_community',
  },
  applicationTick: 5 * 1000,
  hiddenAssets: [
    isProductionHost
      ? 'ef802b475c06189fdbf844153cdc1d449a5ba87cce13d11bb47b5a539f27f12b'
      : '',
    isProductionHost
      ? '30974274078845f263b4f21787e33cc99e9ec19a17ad85a5bc6da2cca91c5a2e'
      : '',
    mkSubject({
      name: 'new_spectrum_token_b',
      policyId: '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404',
    }),
    mkSubject({
      name: 'new_spectrum_token_a',
      policyId: '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404',
    }),
  ],
  blacklistedHistoryAssets: [
    mkSubject({
      name: 'new_spectrum_token_b',
      policyId: '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404',
    }),
    mkSubject({
      name: 'new_spectrum_token_a',
      policyId: '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404',
    }),
  ],
  blacklistedPools: [
    'd5fa50968efd6c80621e206cecbdfd9249f94e68a4e00ad219899b7faad49a93',
    '014c77c54b39748551bbc2487d10df9f905c4116af2cb3fd994a77bff2b85129',
    'a279526d972e41f5a3565ce170327589938ea2bfbf0fb2242005075d99a1ee4c',
    '496b5f14a91e8adaad1dbe772238bb52e286723c972321d9ec3585a54e5b64eb',
    'f20f1021e082d61233dad9289fd8542eda367c3d44b0159d2cdd8a3d9a76256c',
    'd367c8a6c801dc46e4d95680cc6d6dba62a41f77239de6591a0f4159733ee14b',
    'e7e4d7eed6093259446fb1e82bcf2b588db88b97e168b034ee2b097037f952c0',
    '91cc16c56015f567402bbc7736083892b0dae74af5790dbda85db43f09be294e',
    'f1fb942ebd039dc782fd9109acdb60aabea4dc7e75e9c813b6528c62692fc781',
    '8036684cf9f3dd5f56d3a88acb6027552d4a128b65224d574b85d8a88479b3b9',
    'e41aefbc42eb83da15b1f5652c3d57a6a2311359f73d376a0d07556d2eec6781',
    'a6ad7c7628e0511d2058129b25f4d1233f4dc849fe107123452f45918e6bfec6',
    'ea4f010c55fc1fa967fcf732721b1b83624e8ee3ccfa83a2d04843d19dbb5576',
    '79221546233de97b2fe84e3ded1a6c2bc4fb5d8abfffc0ed8e5df9c0f7ed5961',
    '03b45ce062567751507493a9006ba0965c916a15c6232a577700d977e360d897',
    'a3f873a8cd44122e355854d568331107d26298a3624a109d99d16d0d1b8b4431',
    '87eb985875596ca28d6ccff6d92ff38a499d1a991284f40e1717e9fac2ae1c40',
    '8693bd01adab33b8dd78800e9083fa0082dbf7be6e953ab6118d1867e187d68a',
    '7173aed06ab6e21d17f5ddddd04f48cfec611d372e6e9d5095ec9972cd380e9c',
    '1083afadd5dafd4c9628f0936a6e127991a5ddfc7239d00ac275ef5e951f5229',
    'ca6d36f0db717faa72f2b3a44831879874084a2a2fb363da5cd7524a73198f7c',
    '68d1396c0a9f7544c60fbfb6a2b5cc1c796c5582c94b5c2f46e2ab7b1c6ea7b4',
    'c4148eb1302d85ea285085fddc4de511c95680acf21989166ef6c659cced9405',
    '0441515ec45be772e1fc82ed5b31551652cba3b3041db69fadfc61e92ede48cc',
    'd1857fcb360400110c626fb356aa80277e3693c66ecc713c86fd71c78ca10cca',
    'ade270c87aa2615bee6b3ee94244d834352e24113f67dab92dffcdc387395d40',
    'ad5682f1e7a0255e8aea3e574b4df389af549292a4eb5ebcc3c6b61692007e34',
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
  farmsWhiteList: [
    '1b3d37d78650dd8527fa02f8783d9b98490df3b464dd44af0e0593ceb4717702',
    'af629d8e63d08a9770bc543f807bdb82dcda942d4e21d506771f975dc2b3fd3a',
    '24e9f9a3e0aa89092d8690941900323dea2ee3603ca7368c0c35175259df6930',
  ],
  testFarms: [
    '69eff57ea62b13c58e5668e3fbc9927fdb2dffb1c692261f98728a665b2f8abb',
  ],
  lbspLiquidityPools: [
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a70757070795f6164615f6e6674', // TODO: remove test pool
  ],
  operationsRestrictions: [
    {
      asset: 'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413',
      restrictionEnd: DateTime.utc(2022, 2, 2, 19, 0, 0),
      operation: 'swap',
    },
  ],
  cardanoAmmSwapsOpenTime: DateTime.utc(2023, 6, 21, 19, 59, 0),
};
