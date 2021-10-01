import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { Button } from '../Button/Button';
import { DownOutlined } from '../Icon/Icon';
import { Menu } from '../Menu/Menu';
import { Dropdown } from './Dropdown';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
} as Meta<typeof Dropdown>;

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item icon={<DownOutlined />} disabled>
      <a target="_blank" rel="noopener noreferrer">
        2nd menu item (disabled)
      </a>
    </Menu.Item>
    <Menu.Item disabled>
      <a target="_blank" rel="noopener noreferrer">
        3rd menu item (disabled)
      </a>
    </Menu.Item>
    <Menu.Item danger>a danger item</Menu.Item>
  </Menu>
);

export const BasicInline: Story = () => (
  <>
    <h1>Basic Inline</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h4>Default</h4>
        <Dropdown overlay={menu} trigger={['click']}>
          <a>
            Dropdown <DownOutlined />
          </a>
        </Dropdown>
      </Col>
      <Col span={8}>
        <h4>Disabled</h4>
        <Dropdown overlay={menu} trigger={['click']} disabled>
          <a>
            Dropdown <DownOutlined />
          </a>
        </Dropdown>
      </Col>
    </Row>
  </>
);

export const ButtonClassic: Story = () => (
  <>
    <h1>Button Classic</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h4>Default</h4>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button>
            Dropdown <DownOutlined />
          </Button>
        </Dropdown>
      </Col>
      <Col span={8}>
        <h4>Disabled</h4>
        <Dropdown overlay={menu} trigger={['click']} disabled>
          <Button>
            Dropdown <DownOutlined />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  </>
);
