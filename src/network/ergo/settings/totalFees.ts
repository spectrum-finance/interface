import { MinBoxValue } from '@ergolabs/ergo-sdk';
import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { Currency } from '../../../common/models/Currency';
import { calculateTotalFee } from '../../../common/utils/calculateTotalFee';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { maxExFee$, minExFee$, useMaxExFee, useMinExFee } from './executionFee';
import { minerFee$, useMinerFee } from './minerFee';

// TODO: REMOVE TOTAL FEES
export const minTotalFee$ = combineLatest([minerFee$, minExFee$]).pipe(
  map(([minerFee, minExecutionFee]) =>
    calculateTotalFee([minerFee], networkAsset),
  ),
  publishReplay(1),
  refCount(),
);

// TODO: REMOVE TOTAL FEES
export const maxTotalFee$ = combineLatest([minerFee$, maxExFee$]).pipe(
  map(([minerFee, maxExecutionFee]) =>
    calculateTotalFee([minerFee], networkAsset),
  ),
  publishReplay(1),
  refCount(),
);

// TODO: REMOVE TOTAL FEES
export const useMinTotalFee = (): Currency => {
  const minExFee = useMinExFee();
  const minerFee = useMinerFee();

  return calculateTotalFee([minerFee], networkAsset);
};

// TODO: REMOVE TOTAL FEES
export const useMaxTotalFee = (): Currency => {
  const maxExFee = useMaxExFee();
  const minerFee = useMinerFee();

  return calculateTotalFee([minerFee], networkAsset);
};

export const useSwapValidationFee = (): Currency =>
  useMaxTotalFee().plus(MinBoxValue);

export const useDepositValidationFee = (): Currency =>
  useMinTotalFee().plus(MinBoxValue);

export const useRedeemValidationFee = (): Currency =>
  useMinTotalFee().plus(MinBoxValue);

export const useCreatePoolValidationFee = (): Currency => {
  const minerFee = useMinerFee();

  return calculateTotalFee([minerFee, minerFee, MinBoxValue], networkAsset);
};
