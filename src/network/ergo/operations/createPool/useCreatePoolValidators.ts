import { t } from '@lingui/macro';

import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { CreatePoolFormModel } from '../../../../pages/CreatePool/CreatePoolFormModel';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { useCreatePoolValidationFee } from '../../settings/totalFees';

export const useCreatePoolValidators =
  (): OperationValidator<CreatePoolFormModel>[] => {
    const totalFees = useCreatePoolValidationFee();

    const insufficientFeeValidator: OperationValidator<CreatePoolFormModel> = (
      { value: { x, y } },
      balance,
    ) => {
      let totalFeesWithAmount = totalFees;

      totalFeesWithAmount = x?.isAssetEquals(networkAsset)
        ? totalFeesWithAmount.plus(x)
        : totalFeesWithAmount;

      totalFeesWithAmount = y?.isAssetEquals(networkAsset)
        ? totalFeesWithAmount.plus(y)
        : totalFeesWithAmount;

      return totalFeesWithAmount.gt(balance.get(networkAsset))
        ? t`Insufficient ${networkAsset.ticker} Balance for Fees`
        : undefined;
    };

    return [insufficientFeeValidator];
  };
