import { swapVars } from '@ergolabs/ergo-dex-sdk/build/main/amm/common/math/swap';

import { getBaseInputParameters } from '../../utils/walletMath';
import { AmmPool } from '../models/AmmPool';
import { Currency } from '../models/Currency';

export const calculateOutputs = (
  pool: AmmPool,
  input: Currency,
  minExFee: Currency,
  nitro: number,
  slippage: number,
): [Currency | undefined, Currency | undefined] => {
  const extremums = swapVars(
    minExFee.amount,
    nitro,
    getBaseInputParameters(pool, { inputAmount: input, slippage }).minOutput,
  );

  if (!extremums) {
    return [undefined, undefined];
  }

  const minOutput = extremums[1].minOutput;
  const maxOutput = extremums[1].maxOutput;

  return [
    new Currency(
      minOutput.amount,
      minOutput.asset.id === pool.x.asset.id ? pool.x.asset : pool.y.asset,
    ),
    new Currency(
      maxOutput.amount,
      maxOutput.asset.id === pool.x.asset.id ? pool.x.asset : pool.y.asset,
    ),
  ];
};
