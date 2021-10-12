import './Header.scss';

import React from 'react';

import { Logo } from '../Logo/Logo';
import { Tabs } from '../Tabs/Tabs';

// export interface Props {}

export const Header: React.FC = () => {
  return (
    <div className="header-wrapper">
      <Logo label></Logo>
      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="Swap" key="1">
          Swap content
        </Tabs.TabPane>
        <Tabs.TabPane tab="Pool" key="2">
          Pool content
        </Tabs.TabPane>
        <Tabs.TabPane tab="Exchange" key="3">
          Exchange content
        </Tabs.TabPane>
        <Tabs.TabPane tab="Disabled" key="4" disabled>
          Disabled
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
