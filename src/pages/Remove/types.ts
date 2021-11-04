export type RemovableAsset = {
  name: string;
  amount: string;
  earnedFees: string;
};

export type RemovableAssetPair = {
  assetX: RemovableAsset;
  assetY: RemovableAsset;
};
