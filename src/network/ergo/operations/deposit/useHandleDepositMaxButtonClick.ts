import { MinBoxValue } from '@ergolabs/ergo-sdk';

import { NEW_MIN_BOX_VALUE } from '../../../../common/constants/erg';
import { Balance } from '../../../../common/models/Balance';
import { Currency } from '../../../../common/models/Currency';
import { AddLiquidityFormModel } from '../../../../components/AddLiquidityForm/AddLiquidityFormModel';
import { normalizeAmountWithFee } from '../../../../pages/AddLiquidityOrCreatePool/common/utils';
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
    const { xAsset, yAsset, pool } = value;

    if (!xAsset || !yAsset || !pool) {
      throw new Error('Empty form');
    }

    const totalErgFees = minerFee.plus(NEW_MIN_BOX_VALUE);

    let newXAmount = normalizeAmountWithFee(
      balance.get(xAsset).percent(pct),
      balance.get(xAsset),
      networkAsset,
      totalErgFees,
    );
    newXAmount = normalizeAmountWithFee(
      newXAmount,
      balance.get(xAsset),
      feeAsset,
      minExFee,
    );

    let newYAmount = normalizeAmountWithFee(
      pool.calculateDepositAmount(newXAmount),
      balance.get(yAsset),
      networkAsset,
      totalErgFees,
    );
    newYAmount = normalizeAmountWithFee(
      newYAmount,
      balance.get(yAsset),
      feeAsset,
      minExFee,
    );

    if (
      newXAmount.isPositive() &&
      newYAmount.isPositive() &&
      newYAmount.lte(balance.get(yAsset))
    ) {
      return [newXAmount, newYAmount];
    }

    newYAmount = normalizeAmountWithFee(
      balance.get(yAsset).percent(pct),
      balance.get(yAsset),
      networkAsset,
      totalErgFees,
    );
    newYAmount = normalizeAmountWithFee(
      newYAmount,
      balance.get(yAsset),
      feeAsset,
      minExFee,
    );

    newXAmount = normalizeAmountWithFee(
      pool.calculateDepositAmount(newYAmount),
      balance.get(xAsset),
      networkAsset,
      totalErgFees,
    );
    newXAmount = normalizeAmountWithFee(
      newXAmount,
      balance.get(xAsset),
      feeAsset,
      minExFee,
    );

    if (
      newYAmount.isPositive() &&
      newXAmount.isPositive() &&
      newXAmount.lte(balance.get(xAsset))
    ) {
      return [newXAmount, newYAmount];
    }

    if (balance.get(xAsset).isPositive()) {
      return [
        balance.get(xAsset).percent(pct),
        pool.calculateDepositAmount(balance.get(xAsset).percent(pct)),
      ];
    } else {
      return [
        pool.calculateDepositAmount(balance.get(yAsset).percent(pct)),
        balance.get(yAsset).percent(pct),
      ];
    }
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

  return executionFeeAsset?.id === feeAsset.id
    ? spfHandleDepositMaxButtonClick
    : nativeHandleDepositMaxButtonClick;
};
