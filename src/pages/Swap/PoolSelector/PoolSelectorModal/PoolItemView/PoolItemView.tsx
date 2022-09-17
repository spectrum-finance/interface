import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { AssetPairTitle } from '../../../../../components/AssetPairTitle/AssetPairTitle';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { formatToUSD } from '../../../../../services/number';
import { renderFractions } from '../../../../../utils/math';

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
        <Flex.Item marginRight={2}>
          <AssetPairTitle
            size="small"
            assetX={pool.x.asset}
            assetY={pool.y.asset}
            level={5}
          />
        </Flex.Item>
        <Flex.Item marginRight={1}>
          <Typography.Body size="small" secondary>
            Fee
          </Typography.Body>
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <DataTag
            secondary={!mouseEntered && !active}
            content={`${pool.poolFee}%`}
          />
        </Flex.Item>
        <Flex.Item marginRight={1}>
          <Typography.Body size="small" secondary>
            TVL
          </Typography.Body>
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <DataTag
            secondary={!mouseEntered && !active}
            content={
              pool?.tvl
                ? formatToUSD(
                    renderFractions(
                      pool.tvl.value,
                      pool.tvl.units.currency.decimals,
                    ),
                    'abbr',
                  )
                : '–––'
            }
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
      background: var(--spectrum-pool-selector-item-active);
    `}

  ${(props) =>
    !props.active &&
    css`
      &:hover {
        background: var(--spectrum-pool-selector-item-hover);
      }
    `}
`;
