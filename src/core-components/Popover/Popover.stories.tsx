import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Button } from '../Button/Button';
import { Popover } from './Popover';

export default {
  title: 'Components/Popover',
  component: Popover,
} as Meta<typeof Popover>;

const content: JSX.Element = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

export const Default: Story = () => (
  <>
    <h2>Popover</h2>
    <h5>Default</h5>
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button>Show popover</Button>
    </Popover>
  </>
);
