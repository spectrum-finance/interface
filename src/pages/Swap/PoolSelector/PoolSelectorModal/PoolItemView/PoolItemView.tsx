import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { AssetIconPair } from '../../../../../components/AssetIconPair/AssetIconPair';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { VerificationMark } from '../../../../../components/VerificationMark/VerificationMark';
import { formatToUSD } from '../../../../../services/number';

interface PoolItemViewProps {
  readonly pool: AmmPool;
  readonly className?: string;
  readonly active?: boolean;
  readonly onClick?: (pool: AmmPool) => void;
}

const _PoolItemView: FC<PoolItemViewProps> = ({
  pool,
  className,
  onClick,
  active,
}) => {
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);

  const handleClick = () => {
    if (onClick) {
      onClick(pool);
    }
  };

  const handleMouseEnter = () => setMouseEntered(true);

  const handleMouseLeave = () => setMouseEntered(false);

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      bordered={false}
      className={className}
      borderRadius="s"
      padding={[0, 4]}
      onClick={handleClick}
    >
      <Flex align="center" stretch>
        <Flex.Item marginRight={1}>
          <AssetIconPair
            size="small"
            assetX={pool.x.asset}
            assetY={pool.y.asset}
          />
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <Typography.Title level={5}>
            {pool.x.asset.name}/{pool.y.asset.name}
          </Typography.Title>
        </Flex.Item>
        {pool.verified && (
          <Flex.Item marginRight={2} align="center">
            <VerificationMark />
          </Flex.Item>
        )}
        <Flex.Item marginRight={1}>
          <Typography.Footnote>Fee</Typography.Footnote>
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <DataTag
            secondary={!mouseEntered && !active}
            content={`${pool.poolFee}%`}
          />
        </Flex.Item>
        <Flex.Item marginRight={1}>
          <Typography.Footnote>TVL</Typography.Footnote>
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <DataTag
            secondary={!mouseEntered && !active}
            content={pool?.tvl ? formatToUSD(pool.tvl.currency, 'abbr') : '–––'}
          />
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
      background: var(--ergo-pool-selector-item-active);
    `}

  ${(props) =>
    !props.active &&
    css`
      &:hover {
        background: var(--ergo-pool-selector-item-hover);
      }
    `}
`;
