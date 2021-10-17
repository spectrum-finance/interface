import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Slider } from './Slider';

export default {
  title: 'Components/Slider',
  component: Slider,
} as Meta<typeof Slider>;

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

export const Default: Story = () => {
  return (
    <>
      <h2>Slider</h2>
      <h5>Default</h5>
      <Slider marks={marks} defaultValue={50} />
      <h5>Disabled</h5>
      <Slider marks={marks} defaultValue={50} disabled />
    </>
  );
};
