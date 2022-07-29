import { minValueForOrder } from '@ergolabs/ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  ErgoBox,
  InsufficientInputs,
} from '@ergolabs/ergo-sdk';

import { makeTarget } from './makeTarget';

export const getInputs = (
  utxos: ErgoBox[],
  assets: AssetAmount[],
  fees: { minerFee: bigint; uiFee: bigint; exFee: bigint },
): BoxSelection => {
  const minFeeForOrder = minValueForOrder(
    fees.minerFee,
    fees.uiFee,
    fees.exFee,
  );

  const target = makeTarget(assets, minFeeForOrder);

  const inputs = DefaultBoxSelector.select(utxos, target);

  if (inputs instanceof InsufficientInputs) {
    throw new Error(
      `Error in getInputs function: InsufficientInputs -> ${inputs}`,
    );
  }

  return inputs;
};
