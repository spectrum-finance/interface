import './Header.less';

// TODO: https://ergoplatform.myjetbrains.com/youtrack/issue/EDEX-439
import Icon from '@ant-design/icons';
import { useState } from 'react';
import React from 'react';

import { ReactComponent as DarkModeOutlined } from '../../assets/icons/darkmode.svg';
import { ReactComponent as Dots } from '../../assets/icons/icon-dots.svg';
import { useWallet } from '../../context';
import {
  BarChartOutlined,
  Button,
  Dropdown,
  FileTextOutlined,
  GithubOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  Logo,
  Menu,
  Popover,
  QuestionCircleOutlined,
  RightOutlined,
  SettingOutlined,
} from '../../ergodex-cdk';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { NetworkDropdown } from '../NetworkDropdown/NetworkDropdown';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { HeaderTabs } from './HeaderTabs';

const DotsIcon = () => <Icon component={Dots} />;

const networks = [
  { name: 'ergo', token: 'erg' },
  { name: 'cardano', token: 'ada' },
];

const settingsPopup: JSX.Element = (
  <div>
    <p>Content</p>
  </div>
);

export const Header: React.FC = () => {
  const { isWalletConnected, ergBalance, isWalletLoading } = useWallet();
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  const onMenuClicked = (e: { key: string }) => {
    if (e.key === '6') {
      setIsMainMenu(false);
    } else if (e.key === '8') {
      setIsMainMenu(true);
    }
  };

  const onMenuVisibleChange = (flag: boolean) => {
    setMenuVisible(flag);
    if (flag) {
      setIsMainMenu(true);
    }
  };

  const menu = [
    {
      title: 'About',
      icon: <InfoCircleOutlined />,
    },
    {
      title: 'How to use',
      icon: <QuestionCircleOutlined />,
    },
    {
      title: 'Docs',
      icon: <FileTextOutlined />,
    },
    {
      title: 'GitHub',
      icon: <GithubOutlined />,
    },
    {
      title: 'Analytics',
      icon: <BarChartOutlined />,
    },
    {
      title: 'Language',
      icon: <GlobalOutlined />,
      additional: <RightOutlined style={{ marginLeft: 36 }} />,
    },
    {
      title: 'Dark mode',
      icon: <DarkModeOutlined />,
      additional: (
        <ThemeSwitch
          defaultChecked
          size="small"
          className="header__theme-switch"
        />
      ),
    },
  ];

  const menuOthers = (
    <Menu onClick={onMenuClicked} style={{ width: 160 }}>
      {menu.map((item, index) => (
        <Menu.Item key={index + 1} icon={item.icon}>
          <a target="_blank" rel="noopener noreferrer">
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

  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo label />
        <HeaderTabs />

        <div className="header__options">
          <NetworkDropdown networks={networks} />
          <ConnectWallet
            isWalletConnected={isWalletConnected}
            isWalletLoading={isWalletLoading}
            numberOfPendingTxs={0}
            balance={ergBalance}
            currency="ERG"
            address="9iKWmL5t3y9u59fUESsbFQzG933UPjR1v7LUAjM6XPMAcXNhBzL"
          />
          <Popover
            content={settingsPopup}
            trigger="click"
            placement="bottomRight"
          >
            <Button type="text" size="large" icon={<SettingOutlined />} />
          </Popover>
          <Dropdown
            overlay={isMainMenu ? menuOthers : menuLanguages}
            trigger={['click']}
            visible={isMenuVisible}
            onVisibleChange={onMenuVisibleChange}
          >
            <Button size="large" icon={<DotsIcon />} />
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
