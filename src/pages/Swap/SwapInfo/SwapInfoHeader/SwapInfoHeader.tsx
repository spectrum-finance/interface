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
    <Typography.Body>
      {collapsed ? <DownOutlined /> : <UpOutlined />}
    </Typography.Body>
  </Flex>
);

export const SwapInfoHeader = styled(_SwapInfoHeader)`
  width: 100%;
`;
