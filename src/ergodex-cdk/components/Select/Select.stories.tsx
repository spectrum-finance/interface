import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Col, Row } from '../index';
import { Select } from './Select';

const { Option, OptGroup } = Select;

interface BasicProps {
  size: 'small' | 'middle' | 'large' | undefined;
}

export default {
  title: 'Components/Select',
  component: Select,
} as Meta<typeof Select>;

const BasicTemplate = (args: BasicProps) => (
  <Row bottomGutter={4}>
    <Col>
      <Select style={{ width: 200 }} placeholder="Select" size={args.size}>
        <Option value="1">Select menu item</Option>
        <Option value="2">Select menu item</Option>
        <Option value="3" disabled>
          Select menu item disabled
        </Option>
        <OptGroup label="Select Group">
          <Option value="4">Select menu item</Option>
        </OptGroup>
      </Select>
    </Col>

    <Col offset={1}>
      <Select
        style={{ width: 200 }}
        placeholder="Select"
        size={args.size}
        disabled
      >
        <Option value="1">Select menu item</Option>
        <Option value="2">Select menu item</Option>
        <Option value="3" disabled>
          Select menu item disabled
        </Option>
        <OptGroup label="Select Group">
          <Option value="4">Select menu item</Option>
        </OptGroup>
      </Select>
    </Col>
  </Row>
);

const Template: Story = () => (
  <>
    <h1>Select / Input</h1>

    <BasicTemplate size="large" />
    <BasicTemplate size="middle" />
    <BasicTemplate size="small" />
  </>
);

export const SelectTemplate: Story = () => <Template />;
SelectTemplate.storyName = 'Select / Input';
