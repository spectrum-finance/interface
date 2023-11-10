import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Flex, Skeleton, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { IsErgo } from '../../components/IsErgo/IsErgo.tsx';
import { Page } from '../../components/Page/Page';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useSelectedNetwork } from '../../gateway/common/network';
import { useGuardV2 } from '../../hooks/useGuard';
import { isCardano } from '../../utils/network.ts';
import { isSubject, subjectToId } from '../../utils/subjectToId.ts';
import { getAmmPoolConfidenceAnalyticByAmmPoolId } from './AmmPoolConfidenceAnalytic';
import { LockLiquidity } from './LockLiquidity/LockLiquidity';
import { PoolInfoView } from './PoolInfoView/PoolInfoView';
import { PriceHistory } from './PriceHistory/PriceHistory';

export const PoolOverview: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNetwork] = useSelectedNetwork();
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const normalizedPoolId =
    selectedNetwork.name === 'cardano' && isSubject(poolId)
      ? subjectToId(poolId)
      : poolId;

  const [position, loading] = useObservable(
    getPositionByAmmPoolId(normalizedPoolId),
    [],
  );

  const { valBySize } = useDevice();
  const [poolConfidenceAnalytic] = useObservable(
    getAmmPoolConfidenceAnalyticByAmmPoolId(normalizedPoolId),
    [],
  );
  useGuardV2(
    () => !position && !loading,
    () => {
      navigate('../../../liquidity');
    },
  );
  useGuardV2(
    () => selectedNetwork.name === 'cardano' && isSubject(poolId),
    () =>
      navigate(`../../../liquidity/${subjectToId(poolId)}`, { replace: true }),
  );

  return (
    <Page
      transparent
      title={t`Pool overview`}
      maxWidth={isCardano() ? 590 : 984}
      withBackButton
      backTo="../../../liquidity"
    >
      {position &&
      (poolConfidenceAnalytic || selectedNetwork.name !== 'ergo') ? (
        <Flex col={valBySize(true, true, false)}>
          <Flex.Item
            flex={valBySize(undefined, undefined, 1)}
            marginRight={valBySize(0, 0, 2)}
            marginBottom={valBySize(2, 2, 0)}
          >
            <PoolInfoView position={position} />
          </Flex.Item>
          {poolConfidenceAnalytic && (
            <IsErgo>
              <Flex.Item
                width={valBySize<string | number>('100%', '100%', 376)}
                display="flex"
                col={valBySize(true, false, true)}
              >
                <Flex.Item
                  flex={valBySize(undefined, 1, undefined)}
                  marginRight={valBySize(0, 2, 0)}
                  marginBottom={valBySize(2, 0, 2)}
                >
                  <PriceHistory position={position} />
                </Flex.Item>
                <Flex.Item flex={valBySize(undefined, 1, undefined)}>
                  <LockLiquidity
                    poolConfidenceAnalytic={poolConfidenceAnalytic}
                  />
                </Flex.Item>
              </Flex.Item>
            </IsErgo>
          )}
        </Flex>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
