import React, { FC } from 'react';

import { OperationSettings as BaseOperationSettings } from '../../../../components/OperationSettings/OperationSettings';
import { feeAsset, networkAsset } from '../../api/networkAsset/networkAsset';
import {
  useMaxExFee,
  useMinExFee,
} from '../../settings/executionFee/executionFee';
import { patchSettings, useSettings } from '../../settings/settings';

interface Props {
  hideNitro?: boolean;
  hideSlippage?: boolean;
}

export const OperationsSettings: FC<Props> = ({ hideNitro, hideSlippage }) => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const [settings] = useSettings();

  return (
    <BaseOperationSettings
      hideNitro={hideNitro}
      hideSlippage={hideSlippage}
      minExFee={minExFee}
      maxExFee={maxExFee}
      nitro={settings.nitro}
      slippage={settings.slippage}
      executionFeeAsset={settings.executionFeeAsset}
      feeAssets={[networkAsset, feeAsset]}
      setExecutionFeeAsset={(executionFeeAsset) =>
        patchSettings({ executionFeeAsset })
      }
      setNitro={(nitro) => patchSettings({ nitro })}
      setSlippage={(slippage) => patchSettings({ slippage })}
    />
  );
};
