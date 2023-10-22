import { swapExFee } from '@teddyswap/cardano-dex-sdk';
import { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { OperationSettings as BaseOperationSettings } from '../../../../components/OperationSettings/OperationSettings';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../../api/operations/common/minExecutorReward';
import {
  patchSettings,
  setSettings,
  useSettings,
} from '../../settings/settings';

interface Props {
  hideNitro?: boolean;
  hideSlippage?: boolean;
}
export const OperationsSettings: FC<Props> = ({ hideNitro, hideSlippage }) => {
  const settings = useSettings();
  const [minExFee, maxExFee] = swapExFee(
    ammTxFeeMapping,
    minExecutorReward,
    settings.nitro,
  );

  return (
    <BaseOperationSettings
      hideNitro={hideNitro}
      hideSlippage={hideSlippage}
      minExFee={new Currency(minExFee, networkAsset)}
      maxExFee={new Currency(maxExFee, networkAsset)}
      nitro={settings.nitro}
      slippage={settings.slippage}
      executionFeeAsset={settings.executionFeeAsset}
      setExecutionFeeAsset={(executionFeeAsset) =>
        setSettings({ ...settings, executionFeeAsset })
      }
      setNitro={(nitro) => {
        patchSettings({ nitro });
      }}
      setSlippage={(slippage) => patchSettings({ slippage })}
    />
  );
};
