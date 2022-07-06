import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';

export interface TotalLockedCellProps {
  readonly position: Position;
}

export const TotalLockedCell: FC<TotalLockedCellProps> = ({ position }) => (
  <Flex col width={120}>
    <Flex.Item marginBottom={1}>
      <DataTag content={position.lockedX.toString()} justify="flex-end" />
    </Flex.Item>
    <DataTag content={position.lockedY.toString()} justify="flex-end" />
  </Flex>
);
