import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';

export interface WithdrawableLockedCellProps {
  readonly position: Position;
}

export const WithdrawableLockedCell: FC<WithdrawableLockedCellProps> = ({
  position,
}) => (
  <Flex col width={120}>
    <Flex.Item marginBottom={1}>
      <DataTag
        content={position.withdrawableLockedX.toString()}
        justify="flex-end"
      />
    </Flex.Item>
    <DataTag
      content={position.withdrawableLockedY.toString()}
      justify="flex-end"
    />
  </Flex>
);
