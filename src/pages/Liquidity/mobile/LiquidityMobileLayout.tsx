import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Typography,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { SearchInput } from '../../../components/SearchInput/SearchInput';
import { LiquidityLayoutProps } from '../types/LiquidityLayoutProps';

export const LiquidityMobileLayout: FC<LiquidityLayoutProps> = () => (
  <Flex col>
    <Flex.Item marginBottom={2} width="100%">
      <Dropdown
        trigger={['click']}
        overlay={<Menu style={{ overflowY: 'auto', maxHeight: '200px' }} />}
      >
        <Button size="large" style={{ width: '100%' }}>
          <Flex align="center">
            <Flex.Item flex={1} display="flex" justify="flex-start">
              <Typography.Title level={5}>Pool overview</Typography.Title>
            </Flex.Item>
            <DownOutlined />
          </Flex>
        </Button>
      </Dropdown>
    </Flex.Item>
    <Flex.Item>
      <SearchInput />
    </Flex.Item>
  </Flex>
);
