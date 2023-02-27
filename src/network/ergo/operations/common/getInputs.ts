import { minValueForOrder } from '@ergolabs/ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  ErgoBox,
  InsufficientInputs,
  MinBoxValue,
} from '@ergolabs/ergo-sdk';

import { NEW_MIN_BOX_VALUE } from '../../../../common/constants/erg';
import { makeTarget } from './makeTarget';

export const getInputs = (
  utxos: ErgoBox[],
  assets: AssetAmount[],
  fees: { minerFee: bigint; uiFee: bigint; exFee: bigint },
  ignoreMinBoxValue?: boolean,
): BoxSelection => {
  let minFeeForOrder = minValueForOrder(fees.minerFee, fees.uiFee, fees.exFee);

  if (ignoreMinBoxValue) {
    minFeeForOrder -= MinBoxValue;
  }

  const target = makeTarget(assets, minFeeForOrder);

  const inputs = DefaultBoxSelector.select(utxos, target, NEW_MIN_BOX_VALUE);

  if (inputs instanceof InsufficientInputs) {
    throw new Error(
      `Error in getInputs function: InsufficientInputs -> ${inputs}`,
    );
  }

  return inputs;
};
