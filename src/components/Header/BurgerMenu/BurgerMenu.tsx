import './BurgerMenu.less';

import {
  Button,
  Dropdown,
  FileTextOutlined,
  GithubOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  Menu,
  Modal,
  QuestionCircleOutlined,
  ReloadOutlined,
  RightOutlined,
  SettingOutlined,
  useDevice,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { stringify } from 'qs';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ReactComponent as DarkModeOutlined } from '../../../assets/icons/darkmode.svg';
import { panalytics } from '../../../common/analytics';
import {
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
} from '../../../common/constants/locales';
import { useObservable } from '../../../common/hooks/useObservable';
import { useSettings } from '../../../context';
import { globalSettingsModal$ } from '../../../gateway/widgets/globalSettingsModal';
import { useQuery } from '../../../hooks/useQuery';
import { DotsIcon } from '../../common/Icons/DotsIcon';
import { ThemeSwitch } from '../../ThemeSwitch/ThemeSwitch';
import { ManualRefundModal } from './ManualRefundModal/ManualRefundModal';

const MENU_WIDTH = 160;

const BurgerMenu = (): JSX.Element => {
  const [GlobalSettingsModal] = useObservable(globalSettingsModal$);
  const { s } = useDevice();
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const [settings, setSettings] = useSettings();
  const location = useLocation();
  const qs = useQuery();

  const menu = [
    {
      title: t`About`,
      icon: <InfoCircleOutlined />,
      link: 'https://docs.ergodex.io/docs/about-ergodex/intro',
      onClick: () => panalytics.clickBurgerMenu('About'),
    },
    {
      title: t`How to use`,
      icon: <QuestionCircleOutlined />,
      link: 'https://docs.ergodex.io/docs/user-guides/quick-start',
      onClick: () => panalytics.clickBurgerMenu('How to use'),
    },
    {
      title: t`Docs`,
      icon: <FileTextOutlined />,
      link: 'https://docs.ergodex.io',
      onClick: () => panalytics.clickBurgerMenu('Docs'),
    },
    {
      title: 'GitHub',
      icon: <GithubOutlined />,
      link: 'https://github.com/ergolabs',
      onClick: () => panalytics.clickBurgerMenu('GitHub'),
    },
    {
      title: t`Manual Refund`,
      icon: <ReloadOutlined />,
      onClick: () => {
        panalytics.clickBurgerMenu('Manual Refund');
        Modal.open(({ close }) => <ManualRefundModal close={close} />);
      },
    },
    GlobalSettingsModal
      ? {
          title: t`Global Settings`,
          icon: <SettingOutlined />,
          onClick: () => {
            panalytics.clickBurgerMenu('Global Settings');
            Modal.open(({ close }) => <GlobalSettingsModal onClose={close} />);
          },
          isNotRenderMobile: true,
        }
      : undefined,
    {
      title: t`Language`,
      icon: <GlobalOutlined />,
      additional: <RightOutlined style={{ marginLeft: 36 }} />,
      onClick: () => {
        panalytics.clickBurgerMenu('Language');
        setIsMainMenu(false);
      },
    },
    {
      title: t`Dark mode`,
      icon: <DarkModeOutlined />,
      additional: <ThemeSwitch defaultChecked size="small" />,
    },
  ];

  const changeLanguage = (locale: string) => {
    setSettings({
      ...settings,
      lang: locale,
    });
  };

  const menuOthers = (
    <Menu style={{ minWidth: MENU_WIDTH }}>
      {menu.map(
        (item, index) =>
          item && (
            <Menu.Item
              className="ergodex-menu-item"
              key={index + 1}
              icon={item.icon}
              style={{
                display: s && item.isNotRenderMobile ? 'none' : '',
              }}
            >
              <a
                href={item.link}
                rel="noreferrer"
                target={item.link ? '_blank' : ''}
                onClick={item.onClick}
              >
                {item.title}
              </a>
              {item.additional && item.additional}
            </Menu.Item>
          ),
      )}
    </Menu>
  );

  const menuLanguages = (
    <Menu
      style={{
        minWidth: MENU_WIDTH,
      }}
    >
      <Menu.Item key="langs-back" icon={<LeftOutlined />}>
        <a onClick={() => setIsMainMenu(true)} rel="noopener noreferrer" />
      </Menu.Item>
      {SUPPORTED_LOCALES.map((locale) => {
        return (
          <Menu.Item key={locale}>
            <Link
              replace={true}
              to={{
                ...location,
                search: stringify({ ...qs, lng: locale }),
              }}
              rel="noopener noreferrer"
              onClick={() => {
                changeLanguage(locale);
                panalytics.changeLocate(locale);
              }}
            >
              {LOCALE_LABEL[locale]}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const onMenuVisibleChange = (flag: boolean) => {
    setMenuVisible(flag);
    if (flag) {
      setIsMainMenu(true);
    }
  };

  return (
    <Dropdown
      overlay={isMainMenu ? menuOthers : menuLanguages}
      trigger={['click']}
      visible={isMenuVisible}
      onVisibleChange={onMenuVisibleChange}
    >
      <Button className="header__btn" size="large" icon={<DotsIcon />} />
    </Dropdown>
  );
};

export { BurgerMenu };
