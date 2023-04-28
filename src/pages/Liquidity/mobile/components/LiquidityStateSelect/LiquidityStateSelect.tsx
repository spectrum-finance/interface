import {
  Button,
  Control,
  DownOutlined,
  Flex,
  Typography,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { LiquidityState } from '../../../common/types/LiquidityState';

const StyledButton = styled(Button)`
  position: relative;
  width: 100%;

  select {
    height: 100%;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0;
  }
`;

const LiquidityStateSelectText = styled(Typography.Title)`
  font-weight: 400 !important;
`;

export const LiquidityStateSelect: FC<
  Control<LiquidityState> & { showLockedPositions: boolean }
> = ({ value, onChange, showLockedPositions }) => {
  const LiquidityStateCaptions = {
    [LiquidityState.POOLS_OVERVIEW]: t`Pools Overview`,
    [LiquidityState.YOUR_POSITIONS]: t`Your Positions`,
    [LiquidityState.LOCKED_POSITIONS]: t`Locked Positions`,
  };

  return (
    <StyledButton size="large">
      <Flex align="center">
        <Flex.Item flex={1} display="flex" justify="flex-start">
          <LiquidityStateSelectText level={5}>
            {value === LiquidityState.POOLS_OVERVIEW &&
              LiquidityStateCaptions[LiquidityState.POOLS_OVERVIEW]}
            {value === LiquidityState.YOUR_POSITIONS &&
              LiquidityStateCaptions[LiquidityState.YOUR_POSITIONS]}
            {value === LiquidityState.LOCKED_POSITIONS &&
              LiquidityStateCaptions[LiquidityState.LOCKED_POSITIONS]}
          </LiquidityStateSelectText>
        </Flex.Item>
        <DownOutlined />
      </Flex>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value as LiquidityState)}
      >
        <option value={LiquidityState.POOLS_OVERVIEW}>
          {LiquidityStateCaptions[LiquidityState.POOLS_OVERVIEW]}
        </option>
        <option value={LiquidityState.YOUR_POSITIONS}>
          {LiquidityStateCaptions[LiquidityState.YOUR_POSITIONS]}
        </option>
        {showLockedPositions && (
          <option value={LiquidityState.LOCKED_POSITIONS}>
            {LiquidityStateCaptions[LiquidityState.LOCKED_POSITIONS]}
          </option>
        )}
      </select>
    </StyledButton>
  );
};
