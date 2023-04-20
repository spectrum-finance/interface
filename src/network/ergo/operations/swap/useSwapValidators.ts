import { MinBoxValue } from '@ergolabs/ergo-sdk';
import { t } from '@lingui/macro';

import { NEW_MIN_BOX_VALUE } from '../../../../common/constants/erg';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { feeAsset, networkAsset } from '../../api/networkAsset/networkAsset';
import { useMaxExFee as useNativeMaxExFee } from '../../settings/executionFee/nativeExecutionFee';
import { useMaxExFee as useSpfMaxExFee } from '../../settings/executionFee/spfExecutionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useSettings } from '../../settings/settings';

const useNativeFeeSwapValidators = (): OperationValidator<SwapFormModel>[] => {
  const maxExFee = useNativeMaxExFee();
  const minerFee = useMinerFee();

  const insufficientAssetForFeeValidator: OperationValidator<
    Required<SwapFormModel>
  > = ({ value: { fromAmount } }, balance) => {
    const totalFees = minerFee.plus(maxExFee).plus(MinBoxValue);

    const totalFeesWithAmount = fromAmount.isAssetEquals(networkAsset)
      ? fromAmount.plus(totalFees)
      : totalFees;

    return totalFeesWithAmount.gt(balance.get(networkAsset))
      ? t`Insufficient ${networkAsset.ticker} balance for fees`
      : undefined;
  };

  return [insufficientAssetForFeeValidator as any];
};

const useSpfFeeSwapValidators = (): OperationValidator<SwapFormModel>[] => {
  const maxExFee = useSpfMaxExFee();
  const minerFee = useMinerFee();

  const insufficientAssetForFeeValidator: OperationValidator<
    Required<SwapFormModel>
  > = ({ value: { fromAmount } }, balance) => {
    const minerFeeWithMinBoxValue = minerFee.plus(NEW_MIN_BOX_VALUE);
    const totalNErgAmountWithFromAmount = fromAmount.isAssetEquals(networkAsset)
      ? fromAmount.plus(minerFeeWithMinBoxValue)
      : minerFeeWithMinBoxValue;

    if (totalNErgAmountWithFromAmount.gt(balance.get(networkAsset))) {
      return t`Insufficient ${networkAsset.ticker} balance for fees`;
    }

    const maxExFeeWithFromAmount = fromAmount.isAssetEquals(feeAsset)
      ? fromAmount.plus(maxExFee)
      : maxExFee;

    if (maxExFeeWithFromAmount.gt(balance.get(feeAsset))) {
      return t`Insufficient ${feeAsset.ticker} balance for fees`;
    }

    return undefined;
  };

  return [insufficientAssetForFeeValidator as any];
};

export const useSwapValidators = (): OperationValidator<SwapFormModel>[] => {
  const [{ executionFeeAsset }] = useSettings();
  const nativeValidators = useNativeFeeSwapValidators();
  const spfValidators = useSpfFeeSwapValidators();

  return executionFeeAsset?.id === feeAsset.id
    ? spfValidators
    : nativeValidators;
};
