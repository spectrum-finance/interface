import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { ErgoBox } from '@ergolabs/ergo-sdk';
import { useEffect, useState } from 'react';

import { nativeNetworkPools, networkPools } from '../services/networkPools';
import { getListAvailableTokens } from '../utils/getListAvailableTokens';

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
