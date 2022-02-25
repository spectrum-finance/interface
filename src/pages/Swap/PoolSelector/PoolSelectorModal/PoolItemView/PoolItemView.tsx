import React, { FC, useEffect, useState } from 'react';
import { catchError, of } from 'rxjs';
import styled, { css } from 'styled-components';

import { useSubject } from '../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../common/models/AmmPool';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../../../common/streams/poolAnalytic';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { TokenIconPair } from '../../../../../components/TokenIconPair/TokenIconPair';
import { Box, Flex, Typography } from '../../../../../ergodex-cdk';
import { formatToUSD } from '../../../../../services/number';

interface PoolItemViewProps {
  readonly pool: AmmPool;
  readonly className?: string;
  readonly active?: boolean;
  readonly onClick?: (pool: AmmPool) => void;
}

const selectedPoolAnalytic = (ammPoolId: string) =>
  getAggregatedPoolAnalyticsDataById24H(ammPoolId).pipe(
    catchError(() => of(undefined)),
  );

const _PoolItemView: FC<PoolItemViewProps> = ({
  pool,
  className,
  onClick,
  active,
}) => {
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [ammPoolAnalytics, updateAmmPoolAnalytics, loading] =
    useSubject(selectedPoolAnalytic);

  useEffect(() => {
    updateAmmPoolAnalytics(pool.id);
  }, [pool.id]);

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
            loading={loading}
            content={
              ammPoolAnalytics?.tvl
                ? formatToUSD(ammPoolAnalytics.tvl.currency, 'abbr')
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
