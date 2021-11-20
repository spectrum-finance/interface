import { NativeAssetId, NativeAssetInfo } from '@ergolabs/ergo-sdk';
import { AssetAmount, ergoBoxFromProxy, TokenId } from '@ergolabs/ergo-sdk';

import { explorer } from './explorer';

/** List all assets belonging to the current wallet.
 */
export const listWalletAssets = async (): Promise<AssetAmount[]> => {
  const boxes = await ergo
    .get_utxos()
    .then((bxs) => bxs?.map((bx) => ergoBoxFromProxy(bx)));
  if (boxes) {
    const assets = new Map<TokenId, bigint>();
    for (const bx of boxes) {
      const acc = assets.get(NativeAssetId) || 0n;
      assets.set(NativeAssetId, bx.value + acc);
      for (const t of bx.assets) {
        const acc = assets.get(t.tokenId) || 0n;
        assets.set(t.tokenId, t.amount + acc);
      }
    }
    const aggregatedAssets: AssetAmount[] = [];
    for (const [id, amt] of assets.entries()) {
      if (id === NativeAssetId) {
        aggregatedAssets.push(new AssetAmount(NativeAssetInfo, amt));
      } else {
        const networkInfo = await explorer.getFullTokenInfo(id);
        const info = networkInfo ? networkInfo : { id };
        aggregatedAssets.push(new AssetAmount(info, amt));
      }
    }
    return aggregatedAssets;
  }
  return [];
};
