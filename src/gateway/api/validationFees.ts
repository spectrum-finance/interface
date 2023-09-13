import { AddLiquidityFormModel } from '../../components/AddLiquidityForm/AddLiquidityFormModel';
import { OperationValidator } from '../../components/OperationForm/OperationForm';
import { CreatePoolFormModel } from '../../pages/CreatePool/CreatePoolFormModel';
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

export const useCreatePoolValidators =
  (): OperationValidator<CreatePoolFormModel>[] => {
    const [selectedNetwork] = useSelectedNetwork();

    return selectedNetwork.useCreatePoolValidators();
  };
