import { MinBoxValue } from '@ergolabs/ergo-sdk';
import { t } from '@lingui/macro';

import { NEW_MIN_BOX_VALUE } from '../../../../common/constants/erg';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { AddLiquidityFormModel } from '../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { feeAsset, networkAsset } from '../../api/networkAsset/networkAsset';
import { useMinExFee as useNativeMinExFee } from '../../settings/executionFee/nativeExecutionFee';
import { useMinExFee as useSpfMinExFee } from '../../settings/executionFee/spfExecutionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useSettings } from '../../settings/settings';

const useNativeFeeSwapValidators = () => {
  const minExFee = useNativeMinExFee();
  const minerFee = useMinerFee();

  const insufficientFeeValidator: OperationValidator<AddLiquidityFormModel> = (
    { value: { x, y } },
    balance,
  ) => {
    let totalFeesWithAmount = minerFee.plus(minExFee).plus(MinBoxValue);

    totalFeesWithAmount = x?.isAssetEquals(networkAsset)
      ? totalFeesWithAmount.plus(x)
      : totalFeesWithAmount;

    totalFeesWithAmount = y?.isAssetEquals(networkAsset)
      ? totalFeesWithAmount.plus(y)
      : totalFeesWithAmount;

    return totalFeesWithAmount.gt(balance.get(networkAsset))
      ? t`Insufficient ${networkAsset.ticker} balance for fees`
      : undefined;
  };

  return [insufficientFeeValidator];
};

const useSpfFeeSwapValidators = () => {
  const minExFee = useSpfMinExFee();
  const minerFee = useMinerFee();

  const insufficientFeeValidator: OperationValidator<AddLiquidityFormModel> = (
    { value: { x, y } },
    balance,
  ) => {
    let totalErgFeesWithAmount = minerFee;

    totalErgFeesWithAmount = x?.isAssetEquals(networkAsset)
      ? totalErgFeesWithAmount.plus(x)
      : totalErgFeesWithAmount;

    totalErgFeesWithAmount = y?.isAssetEquals(networkAsset)
      ? totalErgFeesWithAmount.plus(y)
      : totalErgFeesWithAmount;

    totalErgFeesWithAmount = totalErgFeesWithAmount.eq(minerFee)
      ? totalErgFeesWithAmount.plus(NEW_MIN_BOX_VALUE)
      : totalErgFeesWithAmount;

    if (totalErgFeesWithAmount.gt(balance.get(networkAsset))) {
      return t`Insufficient ${networkAsset.ticker} balance for fees`;
    }

    let totalSpfFeesWithAmount = minExFee;

    totalSpfFeesWithAmount = x?.isAssetEquals(feeAsset)
      ? totalSpfFeesWithAmount.plus(x)
      : totalSpfFeesWithAmount;

    totalSpfFeesWithAmount = y?.isAssetEquals(feeAsset)
      ? totalSpfFeesWithAmount.plus(y)
      : totalSpfFeesWithAmount;

    return totalSpfFeesWithAmount.gt(balance.get(feeAsset))
      ? t`Insufficient ${feeAsset.ticker} balance for fees`
      : undefined;
  };

  return [insufficientFeeValidator];
};

export const useDepositValidators =
  (): OperationValidator<AddLiquidityFormModel>[] => {
    const [{ executionFeeAsset }] = useSettings();
    const nativeValidators = useNativeFeeSwapValidators();
    const spfValidators = useSpfFeeSwapValidators();

    return executionFeeAsset.id === feeAsset.id
      ? spfValidators
      : nativeValidators;
  };
