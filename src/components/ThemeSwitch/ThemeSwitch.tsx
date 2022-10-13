import { Tabs } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import { panalytics } from '../../common/analytics';
import { useApplicationSettings } from '../../context';

export interface ThemeSwitchProps {
  readonly className?: string;
}

const _ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [settings, setSettings] = useApplicationSettings();
  const { theme } = settings;

  const handleChangeTheme = useCallback(
    (key: 'dark' | 'light' | 'system') => {
      setSettings({
        ...settings,
        theme: key,
      });
      panalytics.changeTheme(key);
    },
    [settings, setSettings],
  );

  return (
    <Tabs
      className={className}
      onChange={handleChangeTheme as any}
      activeKey={theme || 'light'}
    >
      <Tabs.TabPane tab={t`Light`} key="light" />
      <Tabs.TabPane tab={t`Dark`} key="dark" />
      <Tabs.TabPane tab={t`System`} key="system" />
    </Tabs>
  );
};

export const ThemeSwitch = styled(_ThemeSwitch)`
  .ant-tabs-nav-list {
    height: 32px;
  }

  .ant-tabs-tab,
  .ant-tabs-nav-list {
    flex-grow: 1;
  }

  .ant-tabs-tab-btn {
    font-size: 14px;
    line-height: 22px;
  }
`;
