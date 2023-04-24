import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';

export interface ShareColumnProps {
  readonly position: Position;
}

export const ShareColumn: FC<ShareColumnProps> = ({ position }) => (
  <Flex inline>
    <DataTag content={`${position.totalLockedPercent}%`} />
  </Flex>
);
