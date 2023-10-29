import {
  Button,
  Control,
  DownOutlined,
  Flex,
  Typography,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC, useState } from 'react';
import styled from 'styled-components';

import { LiquidityState } from '../../../common/types/LiquidityState';

const StyledButton = styled(Button)`
  position: relative;
  width: 100%;

  .select-state {
    position: absolute;
    z-index: 5;
    background: var(--teddy-default-color);
    width: 100%;
    left: 0;
    top: 45px;
    border-radius: 12px;
    border: 1px solid var(--teddy-secondary-color);
    display: none;
    &.open {
      display: block;
    }
    .option {
      display: flex;
      align-items: center;
      height: 35px;
      cursor: pointer;
      padding: 0 12px;
      &:hover {
        background: var(--teddy-primary-color-hover);
        border-radius: 10px;
      }
    }
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

  const [isOpenOptions, setIsOpenOptions] = useState<boolean>(false);

  const handleClickOpen = () => {
    isOpenOptions ? setIsOpenOptions(false) : setIsOpenOptions(true);
  };

  const handleClickOption = (option) => {
    setIsOpenOptions(false);
    onChange && onChange(option);
  };

  return (
    <StyledButton size="large">
      <Flex align="center" onClick={handleClickOpen}>
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

      <div className={`select-state ${isOpenOptions ? 'open' : ''}`}>
        <div
          className="option"
          onClick={() => handleClickOption(LiquidityState.POOLS_OVERVIEW)}
        >
          {LiquidityStateCaptions[LiquidityState.POOLS_OVERVIEW]}
        </div>
        <div
          className="option"
          onClick={() => handleClickOption(LiquidityState.YOUR_POSITIONS)}
        >
          {LiquidityStateCaptions[LiquidityState.YOUR_POSITIONS]}
        </div>
        {showLockedPositions && (
          <div
            className="option"
            onClick={() => handleClickOption(LiquidityState.LOCKED_POSITIONS)}
          >
            {LiquidityStateCaptions[LiquidityState.LOCKED_POSITIONS]}
          </div>
        )}
      </div>
    </StyledButton>
  );
};
