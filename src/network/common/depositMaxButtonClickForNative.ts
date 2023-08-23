import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { normalizeAmountWithFee } from '../../pages/AddLiquidityOrCreatePool/common/utils';
import { networkAsset } from '../ergo/api/networkAsset/networkAsset';

export const depositMaxButtonClickForNative = (
  totalFees: Currency,
): ((
  pct: number,
  value: AddLiquidityFormModel,
  balance: Balance,
) => [Currency, Currency]) => {
  return (pct, value, balance) => {
    const { xAsset, yAsset, pool } = value;

    if (!xAsset || !yAsset || !pool) {
      throw new Error('Empty form');
    }

    let newXAmount = normalizeAmountWithFee(
      balance.get(xAsset).percent(pct),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );
    let newYAmount = normalizeAmountWithFee(
      pool.calculateDepositAmount(newXAmount),
      balance.get(yAsset),
      networkAsset,
      totalFees,
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
      totalFees,
    );
    newXAmount = normalizeAmountWithFee(
      pool.calculateDepositAmount(newYAmount),
      balance.get(xAsset),
      networkAsset,
      totalFees,
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
