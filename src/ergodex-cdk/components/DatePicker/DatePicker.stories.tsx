/* eslint-disable no-console */
import { Meta, Story } from '@storybook/react';
import React from 'react';

import { DatePicker, Flex, Typography } from '../index';

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
} as Meta<typeof DatePicker>;

export const Base: Story = () => {
  // @ts-ignore
  const handleChange = (date, dateString) => {
    console.log(date);
    console.log(dateString);
  };

  return (
    <Flex col>
      <Flex.Item>
        <Typography.Title level={4}>Range False</Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={4}>Size: Large</Typography.Title>
        <Flex>
          <DatePicker size="large" onChange={handleChange} />
          <DatePicker size="large" disabled onChange={handleChange} />
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={4}>Size: Default</Typography.Title>
        <Flex>
          <DatePicker onChange={handleChange} />
          <DatePicker disabled onChange={handleChange} />
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={4}>Size: Small</Typography.Title>
        <Flex>
          <DatePicker size="small" onChange={handleChange} />
          <DatePicker size="small" disabled onChange={handleChange} />
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

// export const Range: Story = () => {}
