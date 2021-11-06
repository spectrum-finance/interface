import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { useEffect, useState } from 'react';

import { parseUserInputToFractions, renderFractions } from '../utils/math';

interface Pair {
  pair?: AssetPair;
  lpBalance?: number;
  setPair?: (p: AssetPair) => void;
  setLpBalance?: (p: number) => void;
}

const usePair = (pool: AmmPool | undefined): Pair => {
  const [pair, setPair] = useState<AssetPair | undefined>();
  const [lpBalance, setLpBalance] = useState<number | undefined>();

  useEffect(() => {
    if (pool) {
      ergo.get_balance(pool.lp.asset.id).then((lp) => setLpBalance(Number(lp)));
    }
  }, [pool]);

  useEffect(() => {
    if (pool && lpBalance) {
      const sharedPair = pool.shares(
        new AssetAmount(pool.lp.asset, parseUserInputToFractions(lpBalance)),
      );

      const positionPair = {
        assetX: {
          name: sharedPair[0].asset.name || '',
          amount: Number(
            renderFractions(sharedPair[0].amount, sharedPair[0].asset.decimals),
          ),
        },
        assetY: {
          name: sharedPair[1].asset.name || '',
          amount: Number(
            renderFractions(sharedPair[1].amount, sharedPair[1].asset.decimals),
          ),
        },
      };

      setPair(positionPair);
    }
  }, [pool, lpBalance]);

  return { pair, lpBalance, setPair, setLpBalance };
};

export { usePair };
