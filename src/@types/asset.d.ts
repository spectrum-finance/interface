type Asset = {
  name?: string;
  amount: number;
  earnedFees?: number;
};

type AssetPair = {
  assetX: Asset;
  assetY: Asset;
};
