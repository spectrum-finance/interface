import './BurgerMenu.less';

import Icon from '@ant-design/icons';
import React, { useState } from 'react';

import { ReactComponent as DarkModeOutlined } from '../../../assets/icons/darkmode.svg';
import { ReactComponent as Dots } from '../../../assets/icons/icon-dots.svg';
import { ReactComponent as Snowman } from '../../../assets/icons/icon-snowman.svg';
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
import { SnowfallSwitch } from '../../SnowfallSwitch/SnowfallSwitch';
import { ThemeSwitch } from '../../ThemeSwitch/ThemeSwitch';
import { GlobalSettingsModal } from '../GlobalSettingsModal/GlobalSettingsModal';

const DotsIcon = () => <Icon component={Dots} />;

const BurgerMenu = (): JSX.Element => {
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  const menu = [
    {
      title: 'About',
      icon: <InfoCircleOutlined />,
      link: 'https://docs.ergodex.io/docs/about-ergodex/intro',
    },
    {
      title: 'How to use',
      icon: <QuestionCircleOutlined />,
      link: 'https://docs.ergodex.io/docs/user-guides/quick-start',
    },
    {
      title: 'Docs',
      icon: <FileTextOutlined />,
      link: 'https://docs.ergodex.io',
    },
    {
      title: 'GitHub',
      icon: <GithubOutlined />,
      link: 'https://github.com/ergolabs',
    },
    {
      title: 'Global Settings',
      icon: <SettingOutlined />,
      onClick: () =>
        Modal.open(({ close }) => <GlobalSettingsModal onClose={close} />),
    },
    // {
    //   title: 'Analytics',
    //   icon: <BarChartOutlined />,
    //   link: '#',
    // },
    // {
    //   title: 'Language',
    //   icon: <GlobalOutlined />,
    //   additional: <RightOutlined style={{ marginLeft: 36 }} />,
    // },
    {
      title: 'Snowfall',
      icon: <Snowman />,
      additional: <SnowfallSwitch defaultChecked size="small" />,
    },
    {
      title: 'Dark mode',
      icon: <DarkModeOutlined />,
      additional: <ThemeSwitch defaultChecked size="small" />,
    },
  ];

  const menuOthers = (
    <Menu style={{ width: 160 }}>
      {menu.map((item, index) => (
        <Menu.Item
          className="ergodex-menu-item"
          key={index + 1}
          icon={item.icon}
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
    <Menu style={{ width: 160 }}>
      <Menu.Item key="8" icon={<LeftOutlined />} />
      <Menu.Item key="9">
        <a target="_blank" rel="noopener noreferrer">
          English
        </a>
      </Menu.Item>
      <Menu.Item key="10">
        <a target="_blank" rel="noopener noreferrer">
          中国人
        </a>
      </Menu.Item>
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
