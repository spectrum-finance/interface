import './Tabs.stories.css';

import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Tabs } from './Tabs';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta<typeof Tabs>;

export const Default: Story = () => (
  <>
    <h2>Tabs</h2>
    <h5>Default</h5>
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
  </>
);
