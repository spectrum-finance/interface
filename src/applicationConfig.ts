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
  readonly spfUsdRateUrl: string;
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
  readonly lbspBoostedLiquidityPools: string[];
  readonly deprecatedPools: string[];
}

export const applicationConfig: ApplicationConfig = {
  spfUsdRateUrl: 'https://api.spectrum.fi/v1/price-tracking/spf/price',
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
      analyticUrl: 'https://analytics.spectrum.fi/cardano/',
      isCreatePoolAvailable: false,
    },
    cardano: {
      defaultTokenListUrl: 'https://spectrum.fi/cardano-token-list.json',
      metadataUrl:
        'https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/cardano',
      networkUrl: 'https://explorer.spectrum.fi/cardano/mainnet/v1/',
      explorerUrl: 'https://cardanoscan.io',
      lowBalanceGuide: '',
      analyticUrl: 'https://analytics.spectrum.fi/cardano/',
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
  ],
  blacklistedHistoryAssets: [],
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
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a706f6f6c5f6e6674',
    '1c23a9875ca001fb5262366e61b7bd976d5fcf63fc515836eca04aaf636e6574615f6164615f6e6674',
    '93a109d2328a00bb9eef3c71c1a1de5172338adc7d70fc8cf97aaef8636e6574615f6164615f6e6674',
    '538736444e795327bb0a66dd8b2bca0a6a4fffd72052cacf66ed40c7636861726c69335f6164615f6e6674',
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a4144415f53554e4441455f4e4654',
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a4144415f20534e454b5f4e4654',
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a534e454b5f53554e4441455f4e4654',
    'cb15b0ae5322d0b5ec3c91398da464505084daab7e0e419fd59d63fb636861726c69335f6164615f6e6674',
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a6e65775f6e6674',
    'd303a0aea3cf76cf755995f1017b9789bb2d41e3170053e83255065c4d454c445f4144415f4e4654',
  ],
  farmsWhiteList: [
    '1b3d37d78650dd8527fa02f8783d9b98490df3b464dd44af0e0593ceb4717702',
    'af629d8e63d08a9770bc543f807bdb82dcda942d4e21d506771f975dc2b3fd3a',
    '24e9f9a3e0aa89092d8690941900323dea2ee3603ca7368c0c35175259df6930',
    '563394b82c5a518351fd6994a5f115b0165b8f96e05d460453ba21837091b7dd',
    '4136eba32fe50118ce0c556b83f85c0460da975489a3a5f3d0450fef0ab40dd5',
    '53472966344861e6dc21f59517199672a6486b6ebe57aa211cad03afdd6b816f',
    '5f22cb20453e0856acb4b40e4ee2430e4b73a5abe4e72a0b2235a0adfb48a2be',
    'feb3a5c4b30fbe82ae316465c343169fcf3c0db6bc821902be4928270289f6eb',
    '82737701cc3e083ba3644ffd372c543198a74510e0a45e3bc21744c3185abef4',
    '11c4f52ebeb0e1d291f541a095edd0c101fffaf421c6a6744321b9e4934b724d',
    '25f0defafdc6eb7a9942d26ca8e909f620221bbd53d42df648b7366dbb3dde71',
  ],
  testFarms: [
    '69eff57ea62b13c58e5668e3fbc9927fdb2dffb1c692261f98728a665b2f8abb',
  ],
  lbspLiquidityPools: [
    'bca5f2951474244a220f7336f5789fbf9cfbb7fe62bf225a9c99fcae636e6574615f6164615f6e6674',
    '2e11e7313e00ccd086cfc4f1c3ebed4962d31b481b6a153c23601c0f636861726c69335f6164615f6e6674',
    'a6379c282c824035b99725fc1d476b0087aeb8c510fd28c06a2fde44434c41595f4144415f4e4654',
    'c2ea7b366349afda7bab0fbdb712d1e6cec1c91c1cfda21a43998e38436f726e75636f706961735f4144415f4e4654',
    'c0df17aae50c8644d438d1c0f1e876a897febb49fb1c959c8487f996446a65644d6963726f5553445f4144415f4e4654',
    '99f53c6447b7e07f20852bc38e7040efe83deff794d42183a9eba093484f534b595f4144415f4e4654',
    'b992582b95a3ee20cb4025699808c83caaefa7bae9387b72ba2c57c34941475f4144415f4e4654',
    'd0861c6a8e913001a9ceaca2c8f3d403c7ed541e27fab570c0d17a32494e44495f4144415f4e4654',
    'd8beceb1ac736c92df8e1210fb39803508533ae9573cffeb2b24a839696274635f4144415f4e4654',
    '8110fec4abdd3912a07683a776e2936323089745f472152fedded11e697573645f4144415f4e4654',
    'a22ebe57c45d0be3ba4bebca5a9d4877b42d7fd872f3d740414fa124414144415f4144415f4e4654',
    '2ddd621a1658e031c0ef3421bb60a3350b5bc0d062a7e8f94a7f109b4c515f4144415f4e4654',
    '167e27a610f7786055995c6f425935cd05f5e195c776f1d9be009c574d454c445f4144415f4e4654',
    '7e573afb96607a14b237574efb251d337f321c7436ab79051064925a50415649415f4144415f4e4654',
    'e6f445feb406f4151b5e69f51115a42027d2e8f0dc2a7d84c2f03a014e54585f4144415f4e4654',
    '9985928ac3a33e05e884d5cac04c338036b8a35ea9198ffa9c01894e696574685f4144415f4e4654',
    '72f2990e8f906b589926b4290dd511bc846f0ac727c26fd7542f9db2574d545f4144415f4e4654',
    'fd011feb9dc34f85e58e56838989816343f5c62619a82f6a089f0548414749585f4144415f4e4654',
    '544ab8ca262e397d1dce7750742c56f934af83591362fe5b52e29d2b5368656e4d6963726f5553445f4144415f4e4654',
    '4a27465112a39464e6dd5ee470c552ebb3cb42925d5ec04014967908534e454b5f4144415f4e4654',
    'def400a2deaa534e5a73ee15d31b15e77dba28e6859c6c86cf712a574144415f534f43494554595f4e4654',
    'b208df2d037945ab889d95009952aa42d0032a701ad01dacd36c68c1535441424c455f4144415f4e4654',
    'b5be4da4671a056991cc42d3434c6e2a756dc1aa437dc922689421db634254435f4144415f4e4654',
    '7363fa65aae0ce09b283eaf6550ae9dc363f8abe2f1b56b1b719c27b4c4946495f4144415f4e4654',
    'd79bafbe9fe4b1a60e1dc777d0af754cf4e2027ec5159b8faefa14f54f50545f4144415f4e4654',
    '6666493dfb6eca522d7b02581cfbef750f096f03823c69a4502268a942414e4b5f4144415f4e4654',
    '424ae89899ef17e30d2f2ea88ba88a67b092041cb3d5759c2fba68444e4d4b525f4144415f4e4654',
    'cb114d541707030fb93946aa36d0eb448caf2be01674d58493aace06585241595f4144415f4e4654',

    '4871a6b35de12a92b519fa048b8378b87f159b1725700d3f69c035aa4d454c445f4144415f4e4654',
    'f781a51a2da081369b8295e03815877a8d64145512c1eea51f08297c694254435f4144415f4e4654',
    '689b05e40d9b2b7c213aa70be06df1a9c9c4318791b834eb2973c4b7414749585f4144415f4e4654',
    'bb461a9afa6e60962c72d520b476f60f5b24554614531ef1fe342368436f726e75636f706961735f4144415f4e4654',
    '5f4c10f0603a0106d3625922bd97e37e756657b7f253ca9b93fa61104e54585f4144415f4e4654',
    'aee90e8aae33944110d8b807d7564537400f7f646ca507cd26795ff1634254435f4144415f4e4654',
    '16152a3a0c838c07086d1dd188c7f7846ebd418a2af1b80a5d0c3032695553445f4144415f4e4654',
    '1e0fa3a4897f7de17efd0fb74de3f6f1a9a3113f14f14ddeb1532770694554485f4144415f4e4654',

    '6833492a271a21abcecb971f915150d9c2283d0d747b88be9cdf0b75555344435f4144415f4e4654',
    'ff63b385a615b3dce991f4dcf1ff7bd0082927e01e4e699c88ff7d994254435f4144415f4e4654',

    'dd061b480daddd9a833d2477c791356be4e134a433e19df7eb18be1054554e415f4144415f4e4654',
  ],
  lbspBoostedLiquidityPools: [],
  deprecatedPools: [
    'c2ea7b366349afda7bab0fbdb712d1e6cec1c91c1cfda21a43998e38436f726e75636f706961735f4144415f4e4654',
    'd8beceb1ac736c92df8e1210fb39803508533ae9573cffeb2b24a839696274635f4144415f4e4654',
    '8110fec4abdd3912a07683a776e2936323089745f472152fedded11e697573645f4144415f4e4654',
    '167e27a610f7786055995c6f425935cd05f5e195c776f1d9be009c574d454c445f4144415f4e4654',
    'e6f445feb406f4151b5e69f51115a42027d2e8f0dc2a7d84c2f03a014e54585f4144415f4e4654',
    'fd011feb9dc34f85e58e56838989816343f5c62619a82f6a089f0548414749585f4144415f4e4654',
    'b5be4da4671a056991cc42d3434c6e2a756dc1aa437dc922689421db634254435f4144415f4e4654',
    '9985928ac3a33e05e884d5cac04c338036b8a35ea9198ffa9c01894e696574685f4144415f4e4654',
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
