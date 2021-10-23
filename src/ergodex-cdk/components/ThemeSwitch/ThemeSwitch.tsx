import { SwitchProps } from 'antd';
import React, { useCallback, useState } from 'react';

import { useTheme } from '../../../context/Theme';
import { Switch } from '../index';

const addBodyClass = (className: string) =>
  document.body.classList.add(className);
const removeBodyClass = (className: string) =>
  document.body.classList.remove(className);

const ThemeSwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const theme = useTheme();
  const [isDark, setIsDark] = useState(theme === 'dark');

  const handleChangeTheme = useCallback(() => {
    if (isDark) {
      setIsDark(false);
      addBodyClass('light');
      removeBodyClass('dark');
    } else {
      setIsDark(true);
      addBodyClass('dark');
      removeBodyClass('light');
    }
  }, [isDark]);

  return (
    <Switch defaultChecked={isDark} size="small" onChange={handleChangeTheme} />
  );
};

export { ThemeSwitch };
