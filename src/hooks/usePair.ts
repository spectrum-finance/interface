import { AssetAmount } from '@ergolabs/ergo-sdk';
import { useEffect, useState } from 'react';

import { AssetPair } from '../@types/asset';
import { AmmPool } from '../common/models/AmmPool';
import { isWalletLoading$ } from '../services/new/core';
import { parseUserInputToFractions, renderFractions } from '../utils/math';
import { useObservable } from './useObservable';

interface Pair {
  pair?: AssetPair;
  lpBalance?: number;
  setPair?: (p: AssetPair) => void;
  setLpBalance?: (p: number) => void;
  isPairLoading: boolean;
}

const usePair = (pool: AmmPool | undefined): Pair => {
  const [pair, setPair] = useState<AssetPair | undefined>();
  const [lpBalance, setLpBalance] = useState<number | undefined>();
  const [isPairLoading, setIsPairLoading] = useState(true);
  const [isWalletLoading] = useObservable(isWalletLoading$);

  useEffect(() => {
    if (pool && !isWalletLoading) {
      ergo
        .get_balance(pool['pool'].lp.asset.id)
        .then((lp) => setLpBalance(Number(lp)));
    }
  }, [pool?.id, isWalletLoading]);

  useEffect(() => {
    if (lpBalance === 0) {
      setPair(undefined);
      setIsPairLoading(false);
    }

    if (pool && lpBalance && lpBalance !== 0) {
      const sharedPair = pool['pool'].shares(
        new AssetAmount(
          pool['pool'].lp.asset,
          parseUserInputToFractions(lpBalance),
        ),
      );

      const positionPair = {
        assetX: {
          name: sharedPair[0].asset.name || '',
          amount: Number(
            renderFractions(sharedPair[0].amount, sharedPair[0].asset.decimals),
          ),
          asset: sharedPair[0].asset,
        },
        assetY: {
          name: sharedPair[1].asset.name || '',
          amount: Number(
            renderFractions(sharedPair[1].amount, sharedPair[1].asset.decimals),
          ),
          asset: sharedPair[1].asset,
        },
      };

      setPair(positionPair);
      setIsPairLoading(false);
    }
  }, [pool?.id, lpBalance]);

  return { pair, lpBalance, setPair, setLpBalance, isPairLoading };
};

export { usePair };
