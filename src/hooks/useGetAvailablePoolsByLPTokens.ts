import { AmmPool, Explorer, NetworkPools } from 'ergo-dex-sdk';
import { useEffect, useState } from 'react';
import { getListAvailableTokens } from '../utils/getListAvailableTokens';

export const useGetAvailablePoolsByLPTokens = (utxos: any) => {
  const [pools, setPools] = useState<AmmPool[] | null>(null);

  useEffect(() => {
    if (utxos.length > 0) {
      const network = new Explorer('https://api.ergoplatform.com');
      const poolNetwork = new NetworkPools(network);

      const tokenIds = Object.values(getListAvailableTokens(utxos)).map(
        (token) => token.tokenId,
      );
      poolNetwork
        .getByTokensUnion(tokenIds, { offset: 0, limit: 500 })
        .then((data) => {
          const pools = data[0];
          const filterPoolsByLp = pools.filter((pool) =>
            tokenIds.includes(pool.lp.asset.id),
          );
          setPools(filterPoolsByLp);
        })
        // TODO: resolve network error
        .catch((e) => console.log(e));
    }
  }, [utxos]);

  return pools;
};
