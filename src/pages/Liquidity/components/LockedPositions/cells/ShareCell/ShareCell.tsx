import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';

export interface ShareCellProps {
  readonly position: Position;
}

export const ShareCell: FC<ShareCellProps> = ({ position }) => (
  <Flex inline>
    <DataTag content={`${position.totalLockedPercent}%`} />
  </Flex>
);
