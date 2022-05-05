import { Currency } from '../../../common/models/Currency';
import { calculateTotalFee } from '../../../common/utils/calculateTotalFee';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { useMaxExFee, useMinExFee } from './executionFee';
import { useTransactionFee } from './transactionFee';

export const useMinTotalFee = (
  operation: 'swap' | 'deposit' | 'redeem',
): Currency => {
  const minExFee = useMinExFee(operation);
  const transactionFee = useTransactionFee(operation);

  return calculateTotalFee([minExFee, transactionFee], networkAsset);
};

export const useMaxTotalFee = (
  operation: 'swap' | 'deposit' | 'redeem',
): Currency => {
  const maxExFee = useMaxExFee(operation);
  const transactionFee = useTransactionFee(operation);

  return calculateTotalFee([maxExFee, transactionFee], networkAsset);
};
