import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Tabs,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { user } from '@spectrumlabs/analytics';
import { FC, useCallback } from 'react';

import { Theme, useApplicationSettings } from '../../context';
import CometLogo from './comet-logo.png';
import HoskyLogo from './hoski-logo.jpeg';
import SnekLogo from './snek-logo.jpeg';

export const ThemeSwitch: FC = () => {
  const [settings, setSettings] = useApplicationSettings();
  const { theme } = settings;

  const handleChangeTheme = useCallback(
    (key: Theme) => {
      setSettings({
        ...settings,
        theme: key,
      });
      // fireAnalyticsEvent('Select Theme', { theme: key });
      user.set('theme_active', key);
    },
    [settings, setSettings],
  );

  const DropdownOverlay = (): JSX.Element => {
    return (
      <Menu>
        <Menu.Item onClick={() => handleChangeTheme('comet')}>
          <Flex>
            <Flex.Item marginRight={2}>
              <img
                style={{ borderRadius: '999px' }}
                alt="comet logo"
                src={CometLogo}
                width={21}
                height={21}
              />
            </Flex.Item>
            <Flex.Item>Comet theme</Flex.Item>
          </Flex>
        </Menu.Item>
        <Menu.Item onClick={() => handleChangeTheme('snek')}>
          <Flex>
            <Flex.Item marginRight={2}>
              <img
                style={{ borderRadius: '999px' }}
                alt="Snek logo"
                src={SnekLogo}
                width={21}
                height={21}
              />
            </Flex.Item>
            <Flex.Item>Snek theme</Flex.Item>
          </Flex>
        </Menu.Item>
        <Menu.Item
          style={{ display: 'none' }}
          onClick={() => handleChangeTheme('hosky')}
        >
          <Flex.Item marginRight={2}>
            <img
              style={{ borderRadius: '999px' }}
              alt="Hosky logo"
              src={HoskyLogo}
              width={21}
              height={21}
            />
          </Flex.Item>
          <Flex.Item>Hosky theme</Flex.Item>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <Flex col>
      <Flex.Item marginBottom={1}>
        <Typography.Body size="small">
          <Trans>Theme</Trans>
        </Typography.Body>
      </Flex.Item>
      <Flex col>
        <Flex.Item marginBottom={2}>
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
        </Flex.Item>
        <Flex.Item align="center">
          <Dropdown overlay={<DropdownOverlay />}>
            <Button block size="small">
              Meme theme <DownOutlined />
            </Button>
          </Dropdown>
        </Flex.Item>
      </Flex>
    </Flex>
  );
};
