import Icon, { GlobalOutlined, RightOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as DarkModeOutlined } from '../../../assets/icons/darkmode.svg';
import { ReactComponent as Dots } from '../../../assets/icons/icon-dots.svg';
import { useSettings } from '../../../context';
import {
  Button,
  Dropdown,
  FileTextOutlined,
  GithubOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  Menu,
  Modal,
  QuestionCircleOutlined,
  SettingOutlined,
} from '../../../ergodex-cdk';
import { ThemeSwitch } from '../../ThemeSwitch/ThemeSwitch';
import { GlobalSettingsModal } from '../GlobalSettingsModal/GlobalSettingsModal';

const DotsIcon = () => <Icon component={Dots} />;

const BurgerMenu = (): JSX.Element => {
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const { t, i18n } = useTranslation('', { keyPrefix: 'header.settings' });
  const [settings, setSettings] = useSettings();

  const onMenuClicked = (e: { key: string }) => {
    if (e.key !== '6' && e.key !== '8') {
      setMenuVisible(false); // only when entering or returning from languages menu, we do not close modal
    }
    if (e.key === '6') {
      setIsMainMenu(false);
    } else if (e.key === '7') {
      setIsMainMenu(false);
    } else if (e.key === '8') {
      setIsMainMenu(true);
    }
  };

  function handleLanguageChange(language: string) {
    i18n.changeLanguage(language);
    setSettings({
      ...settings,
      language: language,
    });
  }

  const menu = [
    {
      title: t('about'),
      icon: <InfoCircleOutlined />,
      link: 'https://docs.ergodex.io/docs/about-ergodex/intro',
    },
    {
      title: t('howTo'),
      icon: <QuestionCircleOutlined />,
      link: 'https://docs.ergodex.io/docs/user-guides/quick-start',
    },
    {
      title: t('docs'),
      icon: <FileTextOutlined />,
      link: 'https://docs.ergodex.io',
    },
    {
      title: t('gitHub'),
      icon: <GithubOutlined />,
      link: 'https://github.com/ergolabs',
    },
    {
      title: t('globalSettings.title'),
      icon: <SettingOutlined />,
      onClick: () =>
        Modal.open(({ close }) => <GlobalSettingsModal onClose={close} />),
    },
    // {
    //   title: 'Analytics',
    //   icon: <BarChartOutlined />,
    //   link: '#',
    // },
    {
      title: t('language'),
      icon: <GlobalOutlined />,
    },
    {
      title: t('darkMode'),
      icon: <DarkModeOutlined />,
      additional: <ThemeSwitch defaultChecked size="small" />,
    },
  ];

  const menuOthers = (
    <Menu onClick={onMenuClicked} style={{ width: 160 }}>
      {menu.map((item, index) => (
        <Menu.Item key={index + 1} icon={item.icon}>
          {item.onClick ? (
            <a
              rel="noreferrer"
              style={{ marginRight: '24px' }}
              onClick={item.onClick}
            >
              {item.title}
            </a>
          ) : (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ marginRight: '24px' }}
            >
              {item.title}
            </a>
          )}
          {item.additional && item.additional}
        </Menu.Item>
      ))}
    </Menu>
  );

  const languages = [
    { code: 'en', language: 'English' },
    { code: 'de', language: 'Deutsch' },
    { code: 'pt', language: 'Português' },
  ];

  const menuLanguages = (
    <Menu onClick={onMenuClicked} style={{ width: 160 }}>
      <Menu.Item key="8" icon={<LeftOutlined />} />
      {languages.map((item) => (
        <Menu.Item
          key={item.code}
          onClick={() => handleLanguageChange(item.code)}
        >
          {i18n.language == item.code ? <b>{item.language}</b> : item.language}
        </Menu.Item>
      ))}
    </Menu>
  );

  const onMenuVisibleChange = (flag: boolean) => {
    setMenuVisible(flag);
    if (flag) {
      setIsMainMenu(true);
    }
  };

  useEffect(() => {
    // switch to cached language
    if (settings && i18n && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [i18n, settings]);

  return (
    <Dropdown
      overlay={isMainMenu ? menuOthers : menuLanguages}
      trigger={['click']}
      visible={isMenuVisible}
      onVisibleChange={onMenuVisibleChange}
    >
      <Button size="large" icon={<DotsIcon />} />
    </Dropdown>
  );
};

export { BurgerMenu };
