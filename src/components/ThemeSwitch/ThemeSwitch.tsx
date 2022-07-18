import { Switch } from '@ergolabs/ui-kit';
import { SwitchProps } from 'antd';
import React, { useCallback } from 'react';

import { panalytics } from '../../common/analytics';
import { useApplicationSettings } from '../../context';

const ThemeSwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const [settings, setSettings] = useApplicationSettings();
  const { theme } = settings;
  const isDark = theme === 'dark';

  const handleChangeTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    setSettings({
      ...settings,
      theme: newTheme,
    });
    panalytics.changeTheme(newTheme);
  }, [isDark, settings, setSettings]);

  return (
    <Switch defaultChecked={isDark} size="small" onChange={handleChangeTheme} />
  );
};

export { ThemeSwitch };
