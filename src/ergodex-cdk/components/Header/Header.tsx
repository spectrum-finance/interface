import './Header.less';

import {
  BarChartOutlined,
  FileTextOutlined,
  GithubOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Switch } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';

import { ReactComponent as DarkModeOutlined } from '../../../assets/icons/darkmode.svg';
import { ReactComponent as Dot3 } from '../../../assets/icons/dot3.svg';
import { Button } from '../Button/Button';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { Dropdown } from '../Dropdown/Dropdown';
import { Logo } from '../Logo/Logo';
import { Menu } from '../Menu/Menu';
import { NetworkDropdown } from '../NetworkDropdown/NetworkDropdown';
import { Popover } from '../Popover/Popover';
import { Tabs } from '../Tabs/Tabs';

const { SubMenu } = Menu;

const networks = [
  { name: 'ergo', token: 'erg-orange' },
  { name: 'cardano', token: 'ada' },
];

const settingsPopup: JSX.Element = (
  <div>
    <p>Content</p>
  </div>
);

export interface HeaderProps {
  type: 'large' | 'medium' | 'small' | 'xsmall';
}

export const Header: React.FC<HeaderProps> = ({ type = 'large' }) => {
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  const onMenuClicked = (e: any) => {
    if (e.key === '6') {
      setIsMainMenu(false);
    } else if (e.key === '8') {
      setIsMainMenu(true);
    }
  };

  const onMenuVisibleChange = (flag: boolean) => {
    setMenuVisible(flag);
    if (flag === true) {
      setIsMainMenu(true);
    }
  };

  const menuOthers = (
    <Menu onClick={onMenuClicked} style={{ width: 160 }}>
      <Menu.Item key="1" icon={<InfoCircleOutlined />}>
        <a target="_blank" rel="noopener noreferrer">
          About
        </a>
      </Menu.Item>
      <Menu.Item key="2" icon={<QuestionCircleOutlined />}>
        <a target="_blank" rel="noopener noreferrer">
          How to use
        </a>
      </Menu.Item>
      <Menu.Item key="3" icon={<FileTextOutlined />}>
        <a target="_blank" rel="noopener noreferrer">
          Docs
        </a>
      </Menu.Item>
      <Menu.Item key="4" icon={<GithubOutlined />}>
        <a target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </Menu.Item>
      <Menu.Item key="5" icon={<BarChartOutlined />}>
        <a target="_blank" rel="noopener noreferrer">
          Analytics
        </a>
      </Menu.Item>
      <Menu.Item key="6" icon={<GlobalOutlined />}>
        <a target="_blank" rel="noopener noreferrer">
          Language
        </a>
        <RightOutlined style={{ marginLeft: 36 }} />
      </Menu.Item>
      <Menu.Item key="7" icon={<DarkModeOutlined />}>
        <a target="_blank" rel="noopener noreferrer">
          Dark Mode
        </a>
        <Switch defaultChecked size="small" className="header_theme_switch" />
      </Menu.Item>
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
    <div className="header_wrapper">
      <Logo label={type === 'large'} />
      {type === 'large' && <div style={{ width: '20%' }} />}
      {(type === 'large' || type === 'medium') && (
        <Tabs defaultActiveKey="1" type="card">
          <Tabs.TabPane tab="Swap" key="1" />
          <Tabs.TabPane tab="Pool" key="2" />
          <Tabs.TabPane tab="Exchange" key="3" disabled />
        </Tabs>
      )}
      <div style={{ flex: 1 }} />
      <div className="header_network-wrapper">
        <NetworkDropdown networks={networks} />
        {type !== 'xsmall' && <ConnectWallet type="default" />}
        {type !== 'xsmall' && (
          <Popover
            content={settingsPopup}
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined
              style={{ fontSize: '20px' }}
              className="header_settings-btn"
            />
          </Popover>
        )}
        <Dropdown
          overlay={isMainMenu ? menuOthers : menuLanguages}
          trigger={['click']}
          visible={isMenuVisible}
          onVisibleChange={onMenuVisibleChange}
        >
          <Button className="header_others-btn">
            <Dot3 />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};
