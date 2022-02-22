import React, { FC, useEffect } from 'react';
import { catchError, of } from 'rxjs';
import styled from 'styled-components';

import { getAmmPoolsByAssetPair } from '../../../api/ammPools';
import { useSubject } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../common/streams/poolAnalytic';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import { Animation, Box, Button, Flex, Typography } from '../../../ergodex-cdk';
import { formatToUSD } from '../../../services/number';

interface PoolSelectorProps {
  readonly className?: string;
  readonly pool?: AmmPool;
}

const selectedPoolAnalytic = (ammPoolId: string) =>
  getAggregatedPoolAnalyticsDataById24H(ammPoolId).pipe(
    catchError(() => of(undefined)),
  );

const _PoolSelector: FC<PoolSelectorProps> = ({ className, pool }) => {
  const [ammPoolAnalytics, updateAmmPoolAnalytics, loading] =
    useSubject(selectedPoolAnalytic);

  const [availableAmmPools, updateAvailableAmmPools] = useSubject(
    getAmmPoolsByAssetPair,
  );

  useEffect(() => {
    if (pool) {
      updateAmmPoolAnalytics(pool.id);
      updateAvailableAmmPools(pool.x.asset.id, pool.y.asset.id);
    }
  }, [pool?.id]);

  return (
    <>
      <Flex justify="center">
        <Box className={className} padding={pool ? 6 : 0}>
          <Animation.Expand expanded={!!pool} opacityDelay duration={200}>
            {pool && (
              <Flex col>
                <Flex.Item marginBottom={2}>
                  <Typography.Body>Liquidity Pool</Typography.Body>
                  <InfoTooltip
                    content={
                      <>
                        Your operation will be executed in this pool. <br /> You
                        can also choose another pool for this pair
                      </>
                    }
                  />
                </Flex.Item>
                <Flex.Item>
                  <Flex align="center">
                    <Flex.Item marginRight={1}>
                      <TokenIconPair
                        size="small"
                        tokenPair={{
                          tokenA: pool.x.asset.name,
                          tokenB: pool.y.asset.name,
                        }}
                      />
                    </Flex.Item>
                    <Flex.Item marginRight={2}>
                      <Typography.Body strong>
                        {pool.x.asset.name}/{pool.y.asset.name}
                      </Typography.Body>
                    </Flex.Item>
                    <Flex.Item marginRight={1}>
                      <Typography.Footnote>Fee</Typography.Footnote>
                    </Flex.Item>
                    <Flex.Item marginRight={2}>
                      <DataTag content={`${pool.poolFee}%`} />
                    </Flex.Item>
                    <Flex.Item marginRight={1}>
                      <Typography.Footnote>TVL</Typography.Footnote>
                    </Flex.Item>
                    <Flex.Item marginRight={2}>
                      <DataTag
                        loading={loading}
                        content={
                          ammPoolAnalytics?.tvl
                            ? formatToUSD(ammPoolAnalytics.tvl.value, 'abbr')
                            : '–'
                        }
                      />
                    </Flex.Item>
                    <Flex.Item flex={1} display="flex" justify="flex-end">
                      <Button disabled={(availableAmmPools?.length || 0) < 2}>
                        Change
                      </Button>
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </Flex>
            )}
          </Animation.Expand>
        </Box>
      </Flex>
    </>
  );
};

export const PoolSelector = styled(_PoolSelector)`
  border-top-left-radius: initial;
  border-top-right-radius: initial;
  width: 472px;
`;
