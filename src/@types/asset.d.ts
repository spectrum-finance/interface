import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

type Asset = {
  name?: string;
  amount?: number;
  earnedFees?: number;
  asset?: AssetInfo;
};

type AssetPair = {
  assetX: Asset;
  assetY: Asset;
};
