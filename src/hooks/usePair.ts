import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { useEffect, useState } from 'react';

import { selectedNetwork$ } from '../services/new/network';
import { parseUserInputToFractions, renderFractions } from '../utils/math';
import { useObservable } from './useObservable';

interface Pair {
  pair?: AssetPair;
  lpBalance?: number;
  setPair?: (p: AssetPair) => void;
  setLpBalance?: (p: number) => void;
}

const usePair = (pool: AmmPool | undefined): Pair => {
  const [pair, setPair] = useState<AssetPair | undefined>();
  const [lpBalance, setLpBalance] = useState<number | undefined>();
  const [selectedNetwork] = useObservable(selectedNetwork$);

  useEffect(() => {
    if (pool) {
      if (selectedNetwork?.name === 'ergo') {
        ergo
          .get_balance(pool.lp.asset.id)
          .then((lp) => setLpBalance(Number(lp)));
      } else {
        setLpBalance(Number(pool.lp.amount) * 0.17);
      }
    }
  }, [pool, selectedNetwork?.name]);

  useEffect(() => {
    if (pool && lpBalance) {
      let sharedPair = pool.shares(
        new AssetAmount(pool.lp.asset, parseUserInputToFractions(lpBalance)),
      );

      if (selectedNetwork?.name !== 'ergo') {
        sharedPair = [
          new AssetAmount(sharedPair[0].asset, 1000000000n),
          new AssetAmount(sharedPair[1].asset, 1000000000n),
        ];
      }

      console.log(sharedPair);

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
  }, [pool, lpBalance, selectedNetwork?.name]);

  return { pair, lpBalance, setPair, setLpBalance };
};

export { usePair };
