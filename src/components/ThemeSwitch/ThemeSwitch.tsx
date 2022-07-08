import { Switch } from '@ergolabs/ui-kit';
import { SwitchProps } from 'antd';
import React, { useCallback, useState } from 'react';

import { panalytics } from '../../common/analytics';
import { useSettings } from '../../context';

const ThemeSwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const { theme } = settings;
  const [isDark, setIsDark] = useState(theme === 'dark');

  const handleChangeTheme = useCallback(() => {
    if (isDark) {
      setIsDark(false);
      setSettings({
        ...settings,
        theme: 'light',
      });
      panalytics.changeTheme('light');
    } else {
      setIsDark(true);
      setSettings({
        ...settings,
        theme: 'dark',
      });
      panalytics.changeTheme('dark');
    }
  }, [isDark, settings, setSettings]);

  return (
    <Switch defaultChecked={isDark} size="small" onChange={handleChangeTheme} />
  );
};

export { ThemeSwitch };
