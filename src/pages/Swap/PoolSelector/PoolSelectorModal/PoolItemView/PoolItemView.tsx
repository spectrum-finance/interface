import { on } from 'cluster';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { TokenIconPair } from '../../../../../components/TokenIconPair/TokenIconPair';
import { Box, Flex, Typography } from '../../../../../ergodex-cdk';

interface PoolItemViewProps {
  readonly pool: AmmPool;
  readonly className?: string;
  readonly active?: boolean;
  readonly onClick?: (pool: AmmPool) => void;
}

const _PoolItemView: FC<PoolItemViewProps> = ({ pool, className, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(pool);
    }
  };

  return (
    <Box
      className={className}
      borderRadius="s"
      padding={[0, 4]}
      onClick={handleClick}
    >
      <Flex align="center" stretch>
        <Flex.Item marginRight={1}>
          <TokenIconPair
            size="small"
            tokenPair={{
              tokenA: pool.x.asset.name,
              tokenB: pool.y.asset.name,
            }}
          />
        </Flex.Item>
        <Flex.Item marginRight={4}>
          <Typography.Title level={5}>
            {pool.x.asset.name}/{pool.y.asset.name}
          </Typography.Title>
        </Flex.Item>
        <Flex.Item marginRight={1}>
          <Typography.Footnote>Fee</Typography.Footnote>
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <DataTag content={`${pool.poolFee}%`} />
        </Flex.Item>
        <Flex.Item marginRight={1}>
          <Typography.Footnote>Fee</Typography.Footnote>
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <DataTag content={`${pool.poolFee}%`} />
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const PoolItemView = styled(_PoolItemView)`
  cursor: pointer;
  height: 52px;

  ${(props) =>
    props.active &&
    css`
      background: var(--ergo-slider-disabled);
    `}

  ${(props) =>
    !props.active &&
    css`
      &:hover {
        background: var(--ergo-default-card-background);
      }
    `}
`;
