import { Currency } from '../../common/models/Currency';
import { selectedNetwork } from '../common/network';

export const useRefundableDeposit = (): Currency => {
  return selectedNetwork.refundableDeposit;
};
