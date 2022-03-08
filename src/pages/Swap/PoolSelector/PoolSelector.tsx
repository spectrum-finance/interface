import React, { FC, useEffect } from 'react';
import { catchError, of, startWith } from 'rxjs';
import styled from 'styled-components';

import { getAmmPoolsByAssetPair } from '../../../api/ammPools';
import { useSubject } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../common/streams/poolAnalytic';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import {
  Animation,
  Box,
  Button,
  Control,
  Flex,
  Modal,
  Typography,
} from '../../../ergodex-cdk';
import { formatToUSD } from '../../../services/number';
import { PoolSelectorModal } from './PoolSelectorModal/PoolSelectorModal';

interface PoolSelectorProps extends Control<AmmPool> {
  readonly className?: string;
}

const selectedPoolAnalytic = (ammPoolId: string) =>
  getAggregatedPoolAnalyticsDataById24H(ammPoolId).pipe(
    startWith(undefined),
    catchError(() => of(null)),
  );

const _PoolSelector: FC<PoolSelectorProps> = ({
  className,
  value,
  onChange,
}) => {
  const [ammPoolAnalytics, updateAmmPoolAnalytics] =
    useSubject(selectedPoolAnalytic);

  const [availableAmmPools, updateAvailableAmmPools] = useSubject(
    getAmmPoolsByAssetPair,
  );

  useEffect(() => {
    if (value) {
      updateAmmPoolAnalytics(value.id);
      updateAvailableAmmPools(value.x.asset.id, value.y.asset.id);
    }
  }, [value?.id]);

  const openPoolSelectorModal = (pool: AmmPool) =>
    Modal.open(({ close }) => (
      <PoolSelectorModal value={pool} onChange={onChange} close={close} />
    ));

  return (
    <>
      <Flex justify="center">
        <Box className={className} padding={value ? 6 : 0} bordered={false}>
          <Animation.Expand expanded={!!value} opacityDelay duration={200}>
            {value && (
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
                        assetX={value.x.asset}
                        assetY={value.y.asset}
                      />
                    </Flex.Item>
                    <Flex.Item marginRight={2}>
                      <Typography.Body strong>
                        {value.x.asset.name}/{value.y.asset.name}
                      </Typography.Body>
                    </Flex.Item>
                    <Flex.Item marginRight={1}>
                      <Typography.Footnote>Fee:</Typography.Footnote>
                    </Flex.Item>
                    <Flex.Item marginRight={2}>
                      <DataTag secondary content={`${value.poolFee}%`} />
                    </Flex.Item>
                    <Flex.Item marginRight={1}>
                      <Typography.Footnote>TVL:</Typography.Footnote>
                    </Flex.Item>
                    <Flex.Item marginRight={2}>
                      <DataTag
                        secondary
                        loading={ammPoolAnalytics === undefined}
                        content={
                          ammPoolAnalytics?.tvl
                            ? formatToUSD(ammPoolAnalytics.tvl.currency, 'abbr')
                            : '–––'
                        }
                      />
                    </Flex.Item>
                    <Flex.Item flex={1} display="flex" justify="flex-end">
                      <Button
                        disabled={(availableAmmPools?.length || 0) < 2}
                        onClick={() => openPoolSelectorModal(value)}
                      >
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
  background: var(--ergo-page-footer-bg);
  border-top-left-radius: initial;
  border-top-right-radius: initial;
  width: 472px;
`;
