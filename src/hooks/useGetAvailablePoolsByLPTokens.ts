import { useEffect, useState } from 'react';
import { getListAvailableTokens } from '../utils/getListAvailableTokens';
import { networkPools, nativeNetworkPools } from '../services/networkPools';
import { ErgoBox } from '@ergolabs/ergo-sdk';
import { AmmPool } from '@ergolabs/ergo-dex-sdk';

export const useGetAvailablePoolsByLPTokens = (
  utxos: ErgoBox[],
): AmmPool[] | null => {
  const [pools, setPools] = useState<AmmPool[] | null>(null);

  useEffect(() => {
    if (utxos.length > 0) {
      const tokenIds = Object.values(getListAvailableTokens(utxos)).map(
        (token) => token.tokenId,
      );
      nativeNetworkPools()
        .getByTokensUnion(tokenIds, { offset: 0, limit: 500 })
        .then((data) =>
          networkPools()
            .getByTokensUnion(tokenIds, { offset: 0, limit: 500 })
            .then((data2) => data[0].concat(data2[0])),
        )
        .then((pools) => {
          const filterPoolsByLp = pools.filter((pool) =>
            tokenIds.includes(pool.lp.asset.id),
          );
          setPools(filterPoolsByLp);
        })
        // TODO: resolve network error
        .catch((e) => console.error(e));
    }
  }, [utxos]);

  return pools;
};
