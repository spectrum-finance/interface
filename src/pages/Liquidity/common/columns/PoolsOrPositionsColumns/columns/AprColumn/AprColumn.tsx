import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { ErgoAprColumnContent } from './ErgoAprColumnContent/ErgoAprColumnContent';

export interface AprColumnProps {
  readonly ammPool: AmmPool;
  readonly isAllContentTrigger?: boolean;
}

export const AprColumn: FC<AprColumnProps> = ({ ammPool }) => (
  <Flex>
    <DataTag content={<ErgoAprColumnContent ammPool={ammPool} />} />
  </Flex>
);
