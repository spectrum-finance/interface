import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { AssetTitle } from '../../../../../../components/AssetTitle/AssetTitle';

export interface PairColumnProps {
  readonly position: Position;
}

export const PairColumn: FC<PairColumnProps> = ({ position }) => (
  <Flex col>
    <Flex.Item marginBottom={1}>
      <AssetTitle asset={position.totalX.asset} />
    </Flex.Item>
    <AssetTitle asset={position.totalY.asset} />
  </Flex>
);
