import { FC } from 'react';

import { OperationSettings as BaseOperationSettings } from '../../../../components/OperationSettings/OperationSettings';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { setSettings, useSettings } from '../../settings/settings';

interface Props {
  hideNitro?: boolean;
  hideSlippage?: boolean;
}
export const OperationsSettings: FC<Props> = ({ hideNitro, hideSlippage }) => {
  const minExFee = useMinExFee('swap');
  const maxExFee = useMaxExFee('swap');
  const settings = useSettings();

  return (
    <BaseOperationSettings
      hideNitro={hideNitro}
      hideSlippage={hideSlippage}
      minExFee={minExFee}
      maxExFee={maxExFee}
      nitro={settings.nitro}
      slippage={settings.slippage}
      executionFeeAsset={settings.executionFeeAsset}
      setExecutionFeeAsset={(executionFeeAsset) =>
        setSettings({ ...settings, executionFeeAsset })
      }
      setNitro={(nitro) => setSettings({ ...settings, nitro })}
      setSlippage={(slippage) => setSettings({ ...settings, slippage })}
    />
  );
};
