import { Currency } from '../../../common/models/Currency';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../api/operations/common/ammTxFeeMapping';

export const useTransactionFee = (
  operation: 'swap' | 'deposit' | 'redeem',
): Currency => {
  switch (operation) {
    case 'deposit':
      return new Currency(ammTxFeeMapping.depositExecution, networkAsset);
    case 'redeem':
      return new Currency(ammTxFeeMapping.redeemExecution, networkAsset);
    case 'swap':
      return new Currency(ammTxFeeMapping.swapExecution, networkAsset);
  }
};
