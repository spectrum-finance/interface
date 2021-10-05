import { Card, Grid, Input, Text } from '@geist-ui/react';
import { Button, Menu } from 'antd';
import React from 'react';

import { Dropdown } from '../../core-components/Dropdown/Dropdown';

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Cardano
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        Ergo
      </a>
    </Menu.Item>
  </Menu>
);

export const NetworkDropdown: React.FC = (): any => {
  return (
    <Dropdown overlay={menu} placement="bottomLeft" arrow>
      <Button>Cardano</Button>
    </Dropdown>
  );
};
