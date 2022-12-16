import React, { Box, Checkbox, Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled, { css } from 'styled-components';

import { AssetTitle } from '../../../../../components/AssetTitle/AssetTitle';
import { ErgoLmPool } from '../../../../../network/ergo/api/lmPools/ErgoLmPool';
import { ExtendedStake } from '../../../../../network/ergo/api/lmStake/lmStake';

export interface StakeItemProps {
  readonly stake: ExtendedStake;
  readonly lmPool: ErgoLmPool;
  readonly className?: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

const _FarmWithdrawalStakeItem: FC<StakeItemProps> = ({
  stake,
  lmPool,
  className,
  active,
  onClick,
}) => {
  const [x, y] = lmPool.stakeShares(stake);

  return (
    <Box
      secondary
      padding={[4, 3]}
      borderRadius="l"
      className={className}
      onClick={onClick}
    >
      <Flex align="center">
        <Flex.Item marginRight={4}>
          <Checkbox checked={active} />
        </Flex.Item>
        <Flex.Item display="flex" col flex={1}>
          <Flex.Item marginBottom={2}>
            <AssetTitle limit={20} asset={lmPool.ammPool.x.asset} />
          </Flex.Item>
          <Flex.Item>
            <AssetTitle limit={20} asset={lmPool.ammPool.y.asset} />
          </Flex.Item>
        </Flex.Item>
        <Flex.Item display="flex" col justify="flex-end">
          <Flex.Item marginBottom={2} display="flex" justify="flex-end">
            <Typography.Body size="large" strong>
              {x.toCurrencyString()}
            </Typography.Body>
          </Flex.Item>
          <Flex.Item display="flex" justify="flex-end">
            <Typography.Body size="large" strong>
              {y.toCurrencyString()}
            </Typography.Body>
          </Flex.Item>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const FarmWithdrawalStakeItem = styled(_FarmWithdrawalStakeItem)`
  cursor: pointer;
  user-select: none;
  ${(props) =>
    props.active &&
    css`
      border-color: var(--spectrum-primary-color);
    `};
`;
