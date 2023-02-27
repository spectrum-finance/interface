import { Currency } from '../../common/models/Currency';
import { OperationValidator } from '../../components/OperationForm/OperationForm';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { useSelectedNetwork } from '../common/network';

export const useSwapValidators = (): OperationValidator<SwapFormModel>[] => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useSwapValidators();
};

export const useDepositValidators =
  (): OperationValidator<AddLiquidityFormModel>[] => {
    const [selectedNetwork] = useSelectedNetwork();

    return selectedNetwork.useDepositValidators();
  };

export const useCreatePoolValidationFee = (): Currency => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useCreatePoolValidationFee();
};
