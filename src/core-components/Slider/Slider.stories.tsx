import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Slider } from './Slider';

export default {
  title: 'Components/Slider',
  component: Slider,
} as Meta<typeof Slider>;

export const Default: Story = () => {
  return <Slider />;
};
