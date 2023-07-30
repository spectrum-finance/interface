import { Flex, useDevice } from '@ergolabs/ui-kit';
import { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { applicationConfig } from '../../../../../../../applicationConfig.ts';
import { useObservable } from '../../../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { AssetPairTitle } from '../../../../../../../components/AssetPairTitle/AssetPairTitle';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { FarmsButton } from '../../../../../../../components/FarmsButton/FarmsButton';
import { IsCardano } from '../../../../../../../components/IsCardano/IsCardano.tsx';
import { IsErgo } from '../../../../../../../components/IsErgo/IsErgo';
import { LbspPoolTag } from '../../../../../../../components/LbspPoolTag/LbspPoolTag.tsx';
import { hasFarmsForPool } from '../../../../../../../network/ergo/lm/api/farms/farms';

export interface PairColumnProps {
  readonly ammPool: AmmPool;
}

const isLbspPool = (poolId: string): boolean =>
  applicationConfig.lbspLiquidityPools.includes(poolId);

export const PairColumn: FC<PairColumnProps> = ({ ammPool }) => {
  const navigate = useNavigate();
  const [hasFarmForPool] = useObservable(hasFarmsForPool(ammPool.id), []);
  const { s } = useDevice();

  const handleFarmsButtonClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`../../farm?searchString=${ammPool.id}`);
  };

  return (
    <Flex align="center">
      <Flex.Item>
        <AssetPairTitle
          level={s ? 'body-strong' : undefined}
          assetX={ammPool.x.asset}
          assetY={ammPool.y.asset}
          isShowDivider={!s}
        />
      </Flex.Item>
      <Flex.Item marginLeft={2} marginRight={3}>
        <DataTag content={`${ammPool.poolFee}%`} />
      </Flex.Item>
      {/*TODO: IGNORE FOR CARDANO*/}
      <IsErgo>
        {hasFarmForPool && <FarmsButton onClick={handleFarmsButtonClick} />}
      </IsErgo>
      {!s && <IsCardano>{isLbspPool(ammPool.id) && <LbspPoolTag />}</IsCardano>}
    </Flex>
  );
};
