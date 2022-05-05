import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../api/operations/common/minExecutorReward';
import { settings, settings$ } from './settings';

export const useMinExFee = (
  operation: 'swap' | 'deposit' | 'redeem',
): Currency => {
  switch (operation) {
    case 'deposit':
      return new Currency(
        minExecutorReward + ammTxFeeMapping.depositExecution,
        networkAsset,
      );
    case 'swap':
      return new Currency(
        minExecutorReward + ammTxFeeMapping.swapExecution,
        networkAsset,
      );
    case 'redeem':
      return new Currency(
        minExecutorReward + ammTxFeeMapping.redeemExecution,
        networkAsset,
      );
  }
};

export const useMaxExFee = (
  operation: 'swap' | 'deposit' | 'redeem',
): Currency => {
  const minExFee = useMinExFee(operation);
  const [{ nitro }] = useObservable(settings$, [], settings);

  return new Currency(
    BigInt(Math.floor(Number(minExFee.amount) * nitro)),
    networkAsset,
  );
};
