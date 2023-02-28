import { Flex, Tabs, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useCallback } from 'react';

// import { panalytics } from '../../common/analytics';
import { useApplicationSettings } from '../../context';

export const ThemeSwitch: FC = () => {
  const [settings, setSettings] = useApplicationSettings();
  const { theme } = settings;

  const handleChangeTheme = useCallback(
    (key: 'dark' | 'light' | 'system') => {
      setSettings({
        ...settings,
        theme: key,
      });
      // panalytics.changeTheme(key);
    },
    [settings, setSettings],
  );

  return (
    <Flex col>
      <Flex.Item marginBottom={1}>
        <Typography.Body size="small">
          <Trans>Theme</Trans>
        </Typography.Body>
      </Flex.Item>
      <Tabs
        size="small"
        fullWidth
        onChange={handleChangeTheme as any}
        activeKey={theme || 'light'}
      >
        <Tabs.TabPane tab={t`Light`} key="light" />
        <Tabs.TabPane tab={t`Dark`} key="dark" />
        <Tabs.TabPane tab={t`System`} key="system" />
      </Tabs>
    </Flex>
  );
};
