import { Currency } from '../../common/models/Currency';
import { OperationValidator } from '../../components/OperationForm/OperationForm';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { useSelectedNetwork } from '../common/network';

export const useSwapValidators = (): OperationValidator<SwapFormModel>[] => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useSwapValidators();
};

export const useDepositValidationFee = (): Currency => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useDepositValidationFee();
};

export const useCreatePoolValidationFee = (): Currency => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useCreatePoolValidationFee();
};

export const useRedeemValidationFee = (): Currency => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useRedeemValidationFee();
};
