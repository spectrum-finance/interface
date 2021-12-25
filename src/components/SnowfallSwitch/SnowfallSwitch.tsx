import { SwitchProps } from 'antd';
import React, { useCallback, useState } from 'react';

import { useSettings } from '../../context';
import { Switch } from '../../ergodex-cdk';

export const SnowfallSwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const [isActive, setIsActive] = useState(settings.isSnowFallActive);

  const handleChange = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      setSettings({
        ...settings,
        isSnowFallActive: false,
      });
    } else {
      setIsActive(true);
      setSettings({
        ...settings,
        isSnowFallActive: true,
      });
    }
  }, [isActive, settings, setSettings]);

  return (
    <Switch defaultChecked={isActive} size="small" onChange={handleChange} />
  );
};
