import { MinBoxValue } from '@ergolabs/ergo-sdk';

import { Balance } from '../../../../common/models/Balance';
import { Currency } from '../../../../common/models/Currency';
import { AddLiquidityFormModel } from '../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { depositMaxButtonClickForNative } from '../../../common/depositMaxButtonClickForNative';
import { feeAsset, networkAsset } from '../../api/networkAsset/networkAsset';
import { useMinExFee as useNativeMinExFee } from '../../settings/executionFee/nativeExecutionFee';
import { useMinExFee as useSpfMinExFee } from '../../settings/executionFee/spfExecutionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useSettings } from '../../settings/settings';

const useNativeHandleDepositMaxButtonClick = (): ((
  pct: number,
  value: AddLiquidityFormModel,
  balance: Balance,
) => [Currency, Currency]) => {
  const minExFee = useNativeMinExFee();
  const minerFee = useMinerFee();

  return (pct, value, balance) => {
    const totalFees = minerFee.plus(minExFee).plus(MinBoxValue);
    return depositMaxButtonClickForNative(totalFees)(pct, value, balance);
  };
};

const useSpfHandleDepositMaxButtonClick = (): ((
  pct: number,
  value: AddLiquidityFormModel,
  balance: Balance,
) => [Currency, Currency]) => {
  const minExFee = useSpfMinExFee();
  const minerFee = useMinerFee();

  return (pct, value, balance) => {
    const totalFees = minerFee;
    return depositMaxButtonClickForNative(totalFees)(pct, value, balance);
  };
};

export const useHandleDepositMaxButtonClick = (): ((
  pct: number,
  value: AddLiquidityFormModel,
  balance: Balance,
) => [Currency, Currency]) => {
  const [{ executionFeeAsset }] = useSettings();
  const nativeHandleDepositMaxButtonClick =
    useNativeHandleDepositMaxButtonClick();
  const spfHandleDepositMaxButtonClick = useSpfHandleDepositMaxButtonClick();

  return executionFeeAsset.id === feeAsset.id
    ? spfHandleDepositMaxButtonClick
    : nativeHandleDepositMaxButtonClick;
};
