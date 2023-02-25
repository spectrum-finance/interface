import { MinBoxValue } from '@ergolabs/ergo-sdk';

import { Currency } from '../../../../common/models/Currency';
import { feeAsset, networkAsset } from '../../api/networkAsset/networkAsset';
import { useMaxExFee as useNativeMaxExFee } from '../../settings/executionFee/nativeExecutionFee';
import { useMaxExFee as useSpfMaxExFee } from '../../settings/executionFee/spfExecutionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useSettings } from '../../settings/settings';

const useNativeHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  const minerFee = useMinerFee();
  const maxExFee = useNativeMaxExFee();

  return (balance) =>
    balance.asset.id === networkAsset.id
      ? balance.minus(maxExFee).minus(minerFee).minus(MinBoxValue)
      : balance;
};

const useSpfHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  const minerFee = useMinerFee();
  const maxExFee = useSpfMaxExFee();

  return (balance) => {
    if (balance.asset.id === networkAsset.id) {
      return balance.minus(minerFee).minus(MinBoxValue * 4n);
    }
    if (balance.asset.id === feeAsset.id) {
      return balance.minus(maxExFee);
    }
    return balance;
  };
};

export const useHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  const [{ executionFeeAsset }] = useSettings();
  const nativeHandleSwapMaxButtonClick = useNativeHandleSwapMaxButtonClick();
  const spfHandleSwapMaxButtonClick = useSpfHandleSwapMaxButtonClick();

  return executionFeeAsset.id === feeAsset.id
    ? spfHandleSwapMaxButtonClick
    : nativeHandleSwapMaxButtonClick;
};
