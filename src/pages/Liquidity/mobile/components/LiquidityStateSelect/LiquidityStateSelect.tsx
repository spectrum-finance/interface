import {
  Button,
  Control,
  DownOutlined,
  Flex,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { LiquidityState } from '../../../common/types/LiquidityState';
import { LiquidityStateSelectModal } from './LiquidityStateSelectModal/LiquidityStateSelectModal';

const StyledButton = styled(Button)`
  width: 100%;
`;

const LiquidityStateSelectText = styled(Typography.Title)`
  font-weight: 400 !important;
`;

export const LiquidityStateSelect: FC<Control<LiquidityState>> = ({
  value,
  onChange,
}) => {
  const openLiquidityStateSelectModal = () => {
    Modal.open(({ close }) => (
      <LiquidityStateSelectModal close={close} value={value!} />
    ));
  };

  return (
    <StyledButton size="large" onClick={openLiquidityStateSelectModal}>
      <Flex align="center">
        <Flex.Item flex={1} display="flex" justify="flex-start">
          <LiquidityStateSelectText level={5}>
            {value === LiquidityState.POOLS_OVERVIEW && (
              <Trans>Pools Overview</Trans>
            )}
            {value === LiquidityState.YOUR_POSITIONS && (
              <Trans>Your Positions</Trans>
            )}
            {value === LiquidityState.LOCKED_POSITIONS && (
              <Trans>Locked Positions</Trans>
            )}
          </LiquidityStateSelectText>
        </Flex.Item>
        <DownOutlined />
      </Flex>
    </StyledButton>
  );
};
