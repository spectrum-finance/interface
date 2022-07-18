import React, { FC } from 'react';

import { OperationSettings as BaseOperationSettings } from '../../../../components/OperationSettings/OperationSettings';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { patchSettings, useSettings } from '../../settings/settings';

export const OperationsSettings: FC = () => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const [settings] = useSettings();

  return (
    <BaseOperationSettings
      minExFee={minExFee}
      maxExFee={maxExFee}
      nitro={settings.nitro}
      slippage={settings.slippage}
      setNitro={(nitro) => patchSettings({ nitro })}
      setSlippage={(slippage) => patchSettings({ slippage })}
    />
  );
};
