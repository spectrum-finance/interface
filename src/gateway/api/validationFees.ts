import { Currency } from '../../common/models/Currency';
import { useSelectedNetwork } from '../common/network';

export const useSwapValidationFee = (): Currency => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useSwapValidationFee();
};

export const useDepositValidationFee = (): Currency => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useDepositValidationFee();
};

export const useRedeemValidationFee = (): Currency => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useRedeemValidationFee();
};
