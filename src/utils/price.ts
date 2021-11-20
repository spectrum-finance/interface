import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';

import { math, renderFractions } from './math';

export function getPoolRatio(pool: AmmPool): Ratio {
  return getRatio(pool.x, pool.y);
}

export function getRatio(x: AssetAmount, y: AssetAmount): Ratio {
  const xAmount = renderFractions(x.amount, x.asset.decimals);
  const yAmount = renderFractions(y.amount, y.asset.decimals);

  const xPerY = math.evaluate!(`${xAmount} / ${yAmount}`).toFixed(
    x.asset.decimals ?? 0,
  );
  const yPerX = math.evaluate!(`${yAmount} / ${xAmount}`).toFixed(
    y.asset.decimals ?? 0,
  );

  return { xPerY, yPerX };
}
