import React, { FC } from 'react';
import styled from 'styled-components';

import {
  DownOutlined,
  Flex,
  Typography,
  UpOutlined,
} from '../../../../ergodex-cdk';
import { SwapFormModel } from '../../SwapFormModel';
import { RatioView } from './RatioView/RatioView';
import { SlippageTag } from './SlippageTag/SlippageTag';

export interface SwapInfoHeaderProps {
  readonly value: SwapFormModel;
  readonly collapsed?: boolean;
  readonly className?: string;
}

const _SwapInfoHeader: FC<SwapInfoHeaderProps> = ({
  value,
  collapsed,
  className,
}) => (
  <Flex justify="space-between" align="center" className={className}>
    <RatioView value={value} />
    <Flex align="center">
      {!collapsed && (
        <Flex.Item marginRight={4}>
          <SlippageTag />
        </Flex.Item>
      )}
      <Typography.Body>
        {collapsed ? <DownOutlined /> : <UpOutlined />}
      </Typography.Body>
    </Flex>
  </Flex>
);

export const SwapInfoHeader = styled(_SwapInfoHeader)`
  width: 100%;
`;
