import React, { FC } from 'react';

import { OperationSettings as BaseOperationSettings } from '../../../../components/OperationSettings/OperationSettings';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { setSettings } from '../../settings/settings';
import { useSettings } from '../utils';

export const OperationsSettings: FC = () => {
  const minExFee = useMinExFee('swap');
  const maxExFee = useMaxExFee('swap');
  const settings = useSettings();

  return (
    <BaseOperationSettings
      minExFee={minExFee}
      maxExFee={maxExFee}
      nitro={settings.nitro}
      slippage={settings.slippage}
      setNitro={(nitro) => setSettings({ ...settings, nitro })}
      setSlippage={(slippage) => setSettings({ ...settings, slippage })}
    />
  );
};
