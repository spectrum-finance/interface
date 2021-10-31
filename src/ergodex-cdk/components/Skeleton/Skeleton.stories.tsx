import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Skeleton } from './Skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
} as Meta<typeof Skeleton>;

export const Template: Story = () => {
  return (
    <>
      <h5>Active</h5>
      <Skeleton active />
      <Skeleton.Button active />
      <Skeleton.Avatar active />
      <Skeleton.Input active />
      <h5>Not Active</h5>
      <Skeleton />
      <Skeleton.Button />
      <Skeleton.Avatar />
      <Skeleton.Input />
    </>
  );
};
