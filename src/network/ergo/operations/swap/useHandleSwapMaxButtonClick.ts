import { MinBoxValue } from '@ergolabs/ergo-sdk';

import { NEW_MIN_BOX_VALUE } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { feeAsset, networkAsset } from '../../api/networkAsset/networkAsset';
import { calculateUiFeeSync } from '../../api/uiFee/uiFee';
import { useMaxExFee as useNativeMaxExFee } from '../../settings/executionFee/nativeExecutionFee';
import { useMaxExFee as useSpfMaxExFee } from '../../settings/executionFee/spfExecutionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useSettings } from '../../settings/settings';

const useNativeHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  const minerFee = useMinerFee();
  const maxExFee = useNativeMaxExFee();

  return (balance) => {
    if (balance.asset.id === networkAsset.id) {
      const balanceWithoutExAndMinerFees = balance
        .minus(maxExFee)
        .minus(minerFee)
        .minus(MinBoxValue);
      const uiFee = calculateUiFeeSync(balanceWithoutExAndMinerFees);

      return balanceWithoutExAndMinerFees.minus(uiFee);
    }

    return balance;
  };
};

const useSpfHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  const minerFee = useMinerFee();
  const maxExFee = useSpfMaxExFee();

  return (balance) => {
    if (balance.asset.id === networkAsset.id) {
      const balanceWithoutExAndMinerFees = balance
        .minus(minerFee)
        .minus(NEW_MIN_BOX_VALUE);
      const uiFee = calculateUiFeeSync(balanceWithoutExAndMinerFees);

      return balanceWithoutExAndMinerFees.minus(uiFee);
    }
    if (balance.asset.id === feeAsset.id) {
      return balance.minus(maxExFee).minus(10n);
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

  return executionFeeAsset?.id === feeAsset.id
    ? spfHandleSwapMaxButtonClick
    : nativeHandleSwapMaxButtonClick;
};
