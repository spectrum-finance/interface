import './BurgerMenu.less';

import { t } from '@lingui/macro';
import { stringify } from 'qs';
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useLocation } from 'react-router-dom';

import { ReactComponent as DarkModeOutlined } from '../../../assets/icons/darkmode.svg';
import {
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
} from '../../../common/constants/locales';
import { useSettings } from '../../../context';
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
  RightOutlined,
  SettingOutlined,
} from '../../../ergodex-cdk';
import { useQuery } from '../../../hooks/useQuery';
import { DotsIcon } from '../../common/Icons/DotsIcon';
import { ThemeSwitch } from '../../ThemeSwitch/ThemeSwitch';
import { GlobalSettingsModal } from '../GlobalSettingsModal/GlobalSettingsModal';

const MENU_WIDTH = 160;

const BurgerMenu = (): JSX.Element => {
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
    },
    {
      title: t`How to use`,
      icon: <QuestionCircleOutlined />,
      link: 'https://docs.ergodex.io/docs/user-guides/quick-start',
    },
    {
      title: t`Docs`,
      icon: <FileTextOutlined />,
      link: 'https://docs.ergodex.io',
    },
    {
      title: 'GitHub',
      icon: <GithubOutlined />,
      link: 'https://github.com/ergolabs',
    },
    {
      title: t`Global Settings`,
      icon: <SettingOutlined />,
      onClick: () =>
        Modal.open(({ close }) => <GlobalSettingsModal onClose={close} />),
      isNotRenderMobile: true,
    },
    {
      title: t`Language`,
      icon: <GlobalOutlined />,
      additional: <RightOutlined style={{ marginLeft: 36 }} />,
      onClick: () => setIsMainMenu(false),
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
      {menu.map((item, index) => (
        <Menu.Item
          className="ergodex-menu-item"
          key={index + 1}
          icon={item.icon}
          style={{
            display: isMobile && item.isNotRenderMobile ? 'none' : '',
          }}
        >
          {item.onClick ? (
            <a rel="noreferrer" onClick={item.onClick}>
              {item.title}
            </a>
          ) : (
            <a href={item.link} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          )}
          {item.additional && item.additional}
        </Menu.Item>
      ))}
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
              to={{
                ...location,
                search: stringify({ ...qs, lng: locale }),
              }}
              rel="noopener noreferrer"
              onClick={() => changeLanguage(locale)}
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
