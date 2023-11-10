import { Flex, useDevice } from '@ergolabs/ui-kit';
import { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { isDeprecatedPool } from '../../../../../../../common/utils/isDeprecatedPool';
import { AssetPairTitle } from '../../../../../../../components/AssetPairTitle/AssetPairTitle';
import { BoostedPoolTag } from '../../../../../../../components/BoostedPoolTag/BoostedPoolTag.tsx';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { DeprecatedPoolTag } from '../../../../../../../components/DeprecatedPoolTag/DeprecatedPoolTag';
import { FarmsButton } from '../../../../../../../components/FarmsButton/FarmsButton';
import { IsCardano } from '../../../../../../../components/IsCardano/IsCardano.tsx';
import { IsErgo } from '../../../../../../../components/IsErgo/IsErgo';
import { LbspPoolTag } from '../../../../../../../components/LbspPoolTag/LbspPoolTag.tsx';
import { isLbspPool } from '../../../../../../../network/cardano/api/lbspWhitelist/lbspWhitelist.ts';
import { hasFarmsForPool } from '../../../../../../../network/ergo/lm/api/farms/farms';
import { isSpfPool } from '../../../../../../../utils/lbsp.ts';
import { isSpecialBoostedPool } from '../../../../../../../utils/specialPools.ts';

export interface PairColumnProps {
  readonly ammPool: AmmPool;
}

export const PairColumn: FC<PairColumnProps> = ({ ammPool }) => {
  const navigate = useNavigate();
  const [hasFarmForPool] = useObservable(hasFarmsForPool(ammPool.id), []);
  const [_isLbspPool] = useObservable(isLbspPool(ammPool.id));
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
      {!s && (
        <IsCardano>
          {(_isLbspPool || isSpfPool(ammPool.id)) && (
            <Flex.Item marginRight={2}>
              <LbspPoolTag isSpf={isSpfPool(ammPool.id)} />
            </Flex.Item>
          )}
        </IsCardano>
      )}
      {isSpecialBoostedPool(ammPool.id) && !s && (
        <IsCardano>
          <BoostedPoolTag asset={ammPool.y.asset} />
        </IsCardano>
      )}

      <IsCardano>
        {isDeprecatedPool(ammPool.id) && <DeprecatedPoolTag />}
      </IsCardano>
    </Flex>
  );
};
