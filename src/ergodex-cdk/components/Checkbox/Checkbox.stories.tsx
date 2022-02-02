import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Flex, Typography } from '../../index';
import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
} as Meta<typeof Checkbox>;

export const Base: Story = () => {
  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Typography.Title>Checkbox</Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={3}>With label</Typography.Title>
        <Checkbox>Checkbox Label</Checkbox>
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={3}>Without label</Typography.Title>
        <Checkbox />
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={3}>With label Disabled</Typography.Title>
        <Checkbox disabled>Checkbox Label</Checkbox>
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={3}>Without label Disabled</Typography.Title>
        <Checkbox disabled checked />
      </Flex.Item>
    </Flex>
  );
};
