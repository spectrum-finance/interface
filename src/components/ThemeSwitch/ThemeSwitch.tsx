import { Switch } from '@ergolabs/ui-kit';
import { SwitchProps } from 'antd';
import React, { useCallback } from 'react';

import { useSettings } from '../../context';

const ThemeSwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const { theme } = settings;
  const isDark = theme === 'dark';

  const handleChangeTheme = useCallback(() => {
    setSettings({
      ...settings,
      theme: isDark ? 'light' : 'dark',
    });
  }, [isDark, settings, setSettings]);

  return (
    <Switch defaultChecked={isDark} size="small" onChange={handleChangeTheme} />
  );
};

export { ThemeSwitch };
