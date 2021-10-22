import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Typography } from './Typography';

export default {
  title: 'Components/Typography',
  component: Typography,
} as Meta<typeof Typography>;

export const Default: Story = () => (
  <>
    <h2>Title</h2>
    <Typography.Title level={1}>Level 1</Typography.Title>
    <Typography.Title level={2}>Level 2</Typography.Title>
  </>
);
