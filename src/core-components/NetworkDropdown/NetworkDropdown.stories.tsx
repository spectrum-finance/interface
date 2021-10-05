import { Meta, Story } from '@storybook/react';
import React from 'react';

import { NetworkDropdown } from './NetworkDropdown';

export default {
  title: 'Components/NetworkDropdown',
  component: NetworkDropdown,
} as Meta<typeof NetworkDropdown>;

export const Default: Story = () => <NetworkDropdown disabled={false} />;
export const Disabled: Story = () => <NetworkDropdown disabled />;
