import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';

export interface TotalLockedColumnProps {
  readonly position: Position;
}

export const TotalLockedColumn: FC<TotalLockedColumnProps> = ({ position }) => (
  <Flex col width={120}>
    <Flex.Item marginBottom={1}>
      <DataTag content={position.lockedX.toString()} justify="flex-end" />
    </Flex.Item>
    <DataTag content={position.lockedY.toString()} justify="flex-end" />
  </Flex>
);
