import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Flex } from '@ergolabs/ui-kit';
import React from 'react';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { LiquidityPositionsItemAnalytics } from './LiquidityPositionsItemAnalytics/LiquidityPositionsItemAnalytics';
import { LiquidityPositionsItemWrapper } from './LiquidityPositionsItemWrapper/LiquidityPositionsItemWrapper';

interface LiquidityPositionsItemProps {
  pool: AmmPool;
  onClick: (poolId: PoolId) => void;
}

const LiquidityPositionsItem: React.FC<LiquidityPositionsItemProps> = ({
  pool,
  onClick,
}) => (
  <>
    <LiquidityPositionsItemWrapper pool={pool} onClick={onClick}>
      <Flex.Item grow>
        <LiquidityPositionsItemAnalytics pool={pool} />
      </Flex.Item>
    </LiquidityPositionsItemWrapper>
  </>
);

export { LiquidityPositionsItem };
