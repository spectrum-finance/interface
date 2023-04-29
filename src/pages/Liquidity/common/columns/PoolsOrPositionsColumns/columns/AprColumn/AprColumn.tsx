import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';

export interface AprColumnProps {
  readonly ammPool: AmmPool;
}

export const AprColumn: FC<AprColumnProps> = ({ ammPool }) => (
  <Flex>
    <DataTag
      content={
        ammPool?.yearlyFeesPercent ? `${ammPool.yearlyFeesPercent}%` : '—'
      }
    />
  </Flex>
);
