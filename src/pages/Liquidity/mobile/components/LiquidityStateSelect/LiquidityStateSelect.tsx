import { Button, DownOutlined, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  width: 100%;
`;

const LiquidityStateSelectText = styled(Typography.Title)`
  font-weight: 400 !important;
`;

export const LiquidityStateSelect: FC = () => (
  <StyledButton size="large">
    <Flex align="center">
      <Flex.Item flex={1} display="flex" justify="flex-start">
        <LiquidityStateSelectText level={5}>
          Pool overview
        </LiquidityStateSelectText>
      </Flex.Item>
      <DownOutlined />
    </Flex>
  </StyledButton>
);
