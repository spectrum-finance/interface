// TODO: https://ergoplatform.myjetbrains.com/youtrack/issue/EDEX-439
import Icon from '@ant-design/icons';
import React, { useState } from 'react';

import { ReactComponent as DarkModeOutlined } from '../../../assets/icons/darkmode.svg';
import { ReactComponent as Dots } from '../../../assets/icons/icon-dots.svg';
import {
  // BarChartOutlined,
  Button,
  Dropdown,
  // FileTextOutlined,
  GithubOutlined,
  // GlobalOutlined,
  // InfoCircleOutlined,
  LeftOutlined,
  Menu,
  // QuestionCircleOutlined,
  // RightOutlined,
} from '../../../ergodex-cdk';
import { ThemeSwitch } from '../../ThemeSwitch/ThemeSwitch';

const DotsIcon = () => <Icon component={Dots} />;

const BurgerMenu = (): JSX.Element => {
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  const onMenuClicked = (e: { key: string }) => {
    if (e.key === '6') {
      setIsMainMenu(false);
    } else if (e.key === '8') {
      setIsMainMenu(true);
    }
  };

  // TODO: UPDATE_BURGER_MENU_WITH_LINKS [EDEX-470]
  const menu = [
    // {
    //   title: 'About',
    //   icon: <InfoCircleOutlined />,
    //   link: '#',
    // },
    // {
    //   title: 'How to use',
    //   icon: <QuestionCircleOutlined />,
    //   link: '#',
    // },
    // {
    //   title: 'Docs',
    //   icon: <FileTextOutlined />,
    //   link: '#',
    // },
    {
      title: 'GitHub',
      icon: <GithubOutlined />,
      link: 'https://github.com/ergolabs',
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
      title: 'Dark mode',
      icon: <DarkModeOutlined />,
      additional: <ThemeSwitch defaultChecked size="small" />,
    },
  ];

  const menuOthers = (
    <Menu onClick={onMenuClicked} style={{ width: 160 }}>
      {menu.map((item, index) => (
        <Menu.Item key={index + 1} icon={item.icon}>
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: '24px' }}
          >
            {item.title}
          </a>
          {item.additional && item.additional}
        </Menu.Item>
      ))}
    </Menu>
  );

  const menuLanguages = (
    <Menu onClick={onMenuClicked} style={{ width: 160 }}>
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
      <Button size="large" icon={<DotsIcon />} />
    </Dropdown>
  );
};

export { BurgerMenu };
