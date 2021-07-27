import { AmmPool, DefaultAmmPoolsParser, NetworkPools } from 'ergo-dex-sdk';
import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo';
import { useEffect, useState } from 'react';
import { explorer } from '../utils/explorer';
import { getListAvailableTokens } from '../utils/getListAvailableTokens';

export const useGetAvailablePoolsByLPTokens = (
  utxos: ErgoBox[],
): AmmPool[] | null => {
  const [pools, setPools] = useState<AmmPool[] | null>(null);

  useEffect(() => {
    if (utxos.length > 0) {
      const parser = new DefaultAmmPoolsParser();
      const poolNetwork = new NetworkPools(explorer, parser);

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
