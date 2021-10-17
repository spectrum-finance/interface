import { Meta, Story } from '@storybook/react';
import { Col, Divider, Row } from 'antd';
import React from 'react';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '../index';
import { Tag } from './Tag';

export default {
  title: 'Components/Tag',
  component: Tag,
} as Meta<typeof Tag>;

export const Default: Story = () => {
  return (
    <>
      <h2>Tag</h2>
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
        <Col span={24}>
          <h5>Presets</h5>
          <Tag color="success">Success</Tag>
          <Tag color="processing">Processing</Tag>
          <Tag color="error">Error</Tag>
          <Tag color="warning">Warning</Tag>
          <Tag color="default">Default</Tag>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
        <Col span={24}>
          <h5>With Icon</h5>
          <Tag icon={<CheckCircleOutlined />} color="success">
            Success
          </Tag>
          <Tag icon={<SyncOutlined spin />} color="processing">
            Processing
          </Tag>
          <Tag icon={<CloseCircleOutlined />} color="error">
            Error
          </Tag>
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            Warning
          </Tag>
          <Tag icon={<ClockCircleOutlined />} color="default">
            Warning
          </Tag>
          <Tag icon={<MinusCircleOutlined />} color="default">
            Stop
          </Tag>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
        <Col span={24}>
          <h5>Custom</h5>
          <Tag color="magenta">Magenta</Tag>
          <Tag color="red">Red</Tag>
          <Tag color="volcano">Volcano</Tag>
          <Tag color="orange">Orange</Tag>
          <Tag color="gold">Gold</Tag>
          <Tag color="lime">Lime</Tag>
          <Tag color="green">Green</Tag>
          <Tag color="cyan">Cyan</Tag>
          <Tag color="blue">Blue</Tag>
          <Tag color="geekblue">Geekblue</Tag>
          <Tag color="purple">Purple</Tag>
        </Col>
      </Row>
    </>
  );
};
