import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect } from 'react';

import { useSubject } from '../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../common/models/AmmPool';
import { Flex } from '../../../../../ergodex-cdk';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../../../services/new/analytics';
import { LiquidityPositionsItemAnalytics } from './LiquidityPositionsItemAnalytics/LiquidityPositionsItemAnalytics';
import { LiquidityPositionsItemWrapper } from './LiquidityPositionsItemWrapper/LiquidityPositionsItemWrapper';

interface LiquidityPositionsItemProps {
  pool: AmmPool;
  onClick: (poolId: PoolId) => void;
}

const LiquidityPositionsItem: React.FC<LiquidityPositionsItemProps> = ({
  pool,
  onClick,
}) => {
  const [positionAnalytics, updatePositionAnalytics, loading] = useSubject(
    getAggregatedPoolAnalyticsDataById24H,
  );

  useEffect(() => {
    updatePositionAnalytics(pool.id);
  }, [pool]);

  return (
    <>
      <LiquidityPositionsItemWrapper pool={pool} onClick={onClick}>
        <Flex.Item grow>
          <LiquidityPositionsItemAnalytics
            data={positionAnalytics}
            loading={loading}
          />
        </Flex.Item>
      </LiquidityPositionsItemWrapper>
    </>
  );
};

export { LiquidityPositionsItem };
