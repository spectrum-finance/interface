import './Header.scss';

import {
  BarChartOutlined,
  FileTextOutlined,
  GithubOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Switch } from 'antd';
import React from 'react';

import { ReactComponent as DarkModeOutlined } from '../../assets/icons/darkmode.svg';
import { ReactComponent as Dot3 } from '../../assets/icons/dot3.svg';
import { Button } from '../Button/Button';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { Dropdown } from '../Dropdown/Dropdown';
import { Logo } from '../Logo/Logo';
import { Menu } from '../Menu/Menu';
import { NetworkDropdown } from '../NetworkDropdown/NetworkDropdown';
import { Tabs } from '../Tabs/Tabs';

const { SubMenu } = Menu;

const networks = [
  { name: 'ergo', token: 'erg-orange' },
  { name: 'cardano', token: 'ada' },
];

const menuOthers = (
  <Menu>
    <Menu.Item icon={<InfoCircleOutlined />}>
      <a target="_blank" rel="noopener noreferrer">
        About
      </a>
    </Menu.Item>
    <Menu.Item icon={<QuestionCircleOutlined />}>
      <a target="_blank" rel="noopener noreferrer">
        How to use
      </a>
    </Menu.Item>
    <Menu.Item icon={<FileTextOutlined />}>
      <a target="_blank" rel="noopener noreferrer">
        Docs
      </a>
    </Menu.Item>
    <Menu.Item icon={<GithubOutlined />}>
      <a target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </Menu.Item>
    <Menu.Item icon={<BarChartOutlined />}>
      <a target="_blank" rel="noopener noreferrer">
        Analytics
      </a>
    </Menu.Item>
    <SubMenu icon={<GlobalOutlined />} title="Language">
      <Menu.Item>English</Menu.Item>
      <Menu.Item>Chinese</Menu.Item>
    </SubMenu>
    <Menu.Item icon={<DarkModeOutlined />}>
      <a target="_blank" rel="noopener noreferrer">
        Dark Mode
      </a>
      <Switch defaultChecked size="small" className="header_theme_switch" />
    </Menu.Item>
  </Menu>
);

export interface HeaderProps {
  type: 'large' | 'medium' | 'small' | 'xsmall';
}

export const Header: React.FC<HeaderProps> = ({ type = 'large' }) => {
  return (
    <div className="header_wrapper">
      <Logo label={type === 'large'} />
      {type === 'large' && <div style={{ flex: 1 }} />}
      {(type === 'large' || type === 'medium') && (
        <Tabs defaultActiveKey="1" type="card">
          <Tabs.TabPane tab="Swap" key="1" />
          <Tabs.TabPane tab="Pool" key="2" />
          <Tabs.TabPane tab="Exchange" key="3" />
          <Tabs.TabPane tab="Disabled" key="4" disabled />
        </Tabs>
      )}
      <div style={{ flex: 1 }} />
      <div className="header_network-wrapper">
        <NetworkDropdown networks={networks} />
        {type !== 'xsmall' && <ConnectWallet type="default" />}
        {type !== 'xsmall' && (
          <SettingOutlined className="header_settings-btn" />
        )}
        <Dropdown overlay={menuOthers} trigger={['click']}>
          <Button className="header_others-btn">
            <Dot3 />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};
