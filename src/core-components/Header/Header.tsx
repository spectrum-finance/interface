import './Header.scss';

import { SettingOutlined } from '@ant-design/icons';
import React from 'react';

import { Button } from '../Button/Button';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { Dropdown } from '../Dropdown/Dropdown';
import { Logo } from '../Logo/Logo';
import { Menu } from '../Menu/Menu';
import { NetworkDropdown } from '../NetworkDropdown/NetworkDropdown';
import { Tabs } from '../Tabs/Tabs';

const networks = [
  { name: 'ergo', token: 'erg-orange' },
  { name: 'cardano', token: 'ada' },
];

const menuOthers = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

export interface HeaderProps {
  type: 'large' | 'medium' | 'small' | 'xsmall';
}

export const Header: React.FC<HeaderProps> = ({ type = 'large' }) => {
  return (
    <div className="header_wrapper">
      <Logo label={type === 'large'}></Logo>
      {type === 'large' && <div style={{ flex: 1 }}></div>}
      {(type === 'large' || type === 'medium') && (
        <Tabs defaultActiveKey="1" type="card">
          <Tabs.TabPane tab="Swap" key="1" />
          <Tabs.TabPane tab="Pool" key="2" />
          <Tabs.TabPane tab="Exchange" key="3" />
          <Tabs.TabPane tab="Disabled" key="4" disabled />
        </Tabs>
      )}
      <div style={{ flex: 1 }}></div>
      <div className="header_network-wrapper">
        <NetworkDropdown networks={networks} />
        {type !== 'xsmall' && <ConnectWallet type="default" />}
        {type !== 'xsmall' && (
          <SettingOutlined className="header_settings-btn"></SettingOutlined>
        )}
        <Dropdown overlay={menuOthers} trigger={['click']}>
          <Button className="header_others-btn">
            {'\u25CF \u25CF \u25CF'}
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};
