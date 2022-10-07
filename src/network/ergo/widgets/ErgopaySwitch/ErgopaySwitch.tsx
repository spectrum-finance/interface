import { Switch } from '@ergolabs/ui-kit';
import { SwitchProps } from 'antd';
import React, { useCallback } from 'react';

import { patchSettings, useSettings } from '../../settings/settings';

const ErgopaySwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const [{ ergopay }] = useSettings();

  const handleChangeErgopay = useCallback(
    (ergopay) => {
      patchSettings({ ergopay });
    },
    [ergopay],
  );

  return (
    <Switch
      defaultChecked={ergopay}
      size="small"
      onChange={handleChangeErgopay}
    />
  );
};

export { ErgopaySwitch };
