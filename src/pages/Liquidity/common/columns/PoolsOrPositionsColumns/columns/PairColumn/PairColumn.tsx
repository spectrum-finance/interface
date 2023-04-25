import { Flex } from '@ergolabs/ui-kit';
import { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { AssetPairTitle } from '../../../../../../../components/AssetPairTitle/AssetPairTitle';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { FarmsButton } from '../../../../../../../components/FarmsButton/FarmsButton';
import { IsErgo } from '../../../../../../../components/IsErgo/IsErgo';
import { hasFarmsForPool } from '../../../../../../../network/ergo/lm/api/farms/farms';

export interface PairColumnProps {
  readonly ammPool: AmmPool;
}

export const PairColumn: FC<PairColumnProps> = ({ ammPool }) => {
  const navigate = useNavigate();
  const [hasFarmForPool] = useObservable(hasFarmsForPool(ammPool.id), []);

  const handleFarmsButtonClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`../../farm?searchString=${ammPool.id}`);
  };

  return (
    <Flex align="center">
      <Flex.Item>
        <AssetPairTitle assetX={ammPool.x.asset} assetY={ammPool.y.asset} />
      </Flex.Item>
      <Flex.Item marginLeft={2} marginRight={3}>
        <DataTag content={`${ammPool.poolFee}%`} />
      </Flex.Item>
      {/*TODO: IGNORE FOR CARDANO*/}
      <IsErgo>
        {hasFarmForPool && <FarmsButton onClick={handleFarmsButtonClick} />}
      </IsErgo>
    </Flex>
  );
};
