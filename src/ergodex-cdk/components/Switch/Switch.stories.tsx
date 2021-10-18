import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Switch } from './Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
} as Meta<typeof Switch>;

export const Template: Story = () => {
  return (
    <>
      <h2>Switch</h2>
      <h5>Default</h5>
      <Switch defaultChecked />
      <Switch defaultChecked size="small" />
      <Switch />
      <Switch size="small" />
      <h5>Loading</h5>
      <Switch defaultChecked loading />
      <Switch defaultChecked size="small" loading />
      <Switch loading />
      <Switch size="small" loading />
    </>
  );
};
