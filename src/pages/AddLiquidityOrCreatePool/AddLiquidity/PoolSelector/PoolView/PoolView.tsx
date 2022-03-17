import React, { FC, useEffect } from 'react';
import { catchError, of, startWith } from 'rxjs';

import { useSubject } from '../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../common/models/AmmPool';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../../../common/streams/poolAnalytic';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { TokenIconPair } from '../../../../../components/TokenIconPair/TokenIconPair';
import { Flex, Typography } from '../../../../../ergodex-cdk';
import { formatToUSD } from '../../../../../services/number';

interface PoolSelectorItemProps {
  readonly ammPool: AmmPool;
  readonly hover?: boolean;
  readonly active?: boolean;
}

const selectedPoolAnalytic = (ammPoolId: string) =>
  getAggregatedPoolAnalyticsDataById24H(ammPoolId).pipe(
    startWith(undefined),
    catchError(() => of(null)),
  );

export const PoolView: FC<PoolSelectorItemProps> = ({
  ammPool,
  hover,
  active,
}) => {
  const [ammPoolAnalytics, updateAmmPoolAnalytics] =
    useSubject(selectedPoolAnalytic);

  useEffect(() => {
    if (ammPool) {
      updateAmmPoolAnalytics(ammPool.id);
    }
  }, [ammPool?.id]);

  return (
    <Flex align="center" stretch>
      <Flex.Item marginRight={1}>
        <TokenIconPair assetX={ammPool.x.asset} assetY={ammPool.y.asset} />
      </Flex.Item>
      <Flex.Item marginRight={1} align="center">
        <Typography.Title level={5}>
          {ammPool.x.asset.name}/{ammPool.y.asset.name}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginRight={1} align="center">
        <Typography.Footnote>Fee:</Typography.Footnote>
      </Flex.Item>
      <Flex.Item marginRight={2} align="center">
        <DataTag
          size="default"
          secondary={!hover && !active}
          loading={ammPoolAnalytics === undefined}
          content={`${ammPool.poolFee}%`}
        />
      </Flex.Item>
      <Flex.Item marginRight={1} align="center">
        <Typography.Footnote>TVL:</Typography.Footnote>
      </Flex.Item>
      <Flex.Item>
        <DataTag
          size="default"
          secondary={!hover && !active}
          loading={ammPoolAnalytics === undefined}
          content={
            ammPoolAnalytics?.tvl
              ? formatToUSD(ammPoolAnalytics.tvl.currency, 'abbr')
              : '–––'
          }
        />
      </Flex.Item>
    </Flex>
  );
};
