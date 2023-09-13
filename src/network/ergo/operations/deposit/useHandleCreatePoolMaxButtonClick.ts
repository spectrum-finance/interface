import { FormGroup } from '@ergolabs/ui-kit';

import { Balance } from '../../../../common/models/Balance';
import { Ratio } from '../../../../common/models/Ratio';
import { normalizeAmountWithFee } from '../../../../pages/AddLiquidityOrCreatePool/common/utils';
import { CreatePoolFormModel } from '../../../../pages/CreatePool/CreatePoolFormModel';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { useCreatePoolValidationFee } from '../../settings/totalFees';

export const useHandleCreatePoolMaxButtonClick = (): ((
  pct: number,
  form: FormGroup<CreatePoolFormModel>,
  balance: Balance,
) => void) => {
  const totalFees = useCreatePoolValidationFee();
  return (pct, form, balance) => {
    const { xAsset, yAsset, initialPrice } = form.value;

    if (!xAsset || !yAsset || !initialPrice) {
      return;
    }

    let newXAmount = normalizeAmountWithFee(
      balance.get(xAsset).percent(pct),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );
    let ratio: Ratio =
      initialPrice.quoteAsset.id === newXAmount?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();
    let newYAmount = normalizeAmountWithFee(
      ratio.toBaseCurrency(newXAmount),
      balance.get(yAsset),
      networkAsset,
      totalFees,
    );

    if (
      newXAmount.isPositive() &&
      newYAmount.isPositive() &&
      newYAmount.lte(balance.get(yAsset))
    ) {
      form.patchValue(
        {
          x: newXAmount,
          y: newYAmount,
        },
        { emitEvent: 'silent' },
      );
      return;
    }

    newYAmount = normalizeAmountWithFee(
      balance.get(yAsset).percent(pct),
      balance.get(yAsset),
      networkAsset,
      totalFees,
    );
    ratio =
      initialPrice.quoteAsset.id === newYAmount?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();
    newXAmount = normalizeAmountWithFee(
      ratio.toBaseCurrency(newYAmount),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );

    if (
      newYAmount.isPositive() &&
      newXAmount.isPositive() &&
      newXAmount.lte(balance.get(xAsset))
    ) {
      form.patchValue(
        {
          x: newXAmount,
          y: newYAmount,
        },
        { emitEvent: 'silent' },
      );
      return;
    }

    if (balance.get(xAsset).isPositive()) {
      ratio =
        initialPrice.quoteAsset.id === xAsset.id
          ? initialPrice
          : initialPrice.invertRatio();

      form.patchValue(
        {
          x: balance.get(xAsset).percent(pct),
          y: ratio.toBaseCurrency(balance.get(xAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
      return;
    } else {
      ratio =
        initialPrice.quoteAsset.id === yAsset.id
          ? initialPrice
          : initialPrice.invertRatio();

      form.patchValue(
        {
          y: balance.get(yAsset).percent(pct),
          x: ratio.toBaseCurrency(balance.get(yAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
    }
  };
};
