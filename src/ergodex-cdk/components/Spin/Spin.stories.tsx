import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Spin } from './Spin';

export default {
  title: 'Components/Typography',
  component: Spin,
} as Meta<typeof Spin>;

export const Default: Story = () => (
  <>
    <h2>Spin</h2>
    <h5>Small</h5>
    <Spin size="small" />

    <h5>Default</h5>
    <Spin size="default" />

    <h5>Large</h5>
    <Spin size="large" />
  </>
);
