import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { IsCardano } from '../../../../../../../components/IsCardano/IsCardano';
import { IsErgo } from '../../../../../../../components/IsErgo/IsErgo';
import { ErgoAprColumnContent } from './ErgoAprColumnContent/ErgoAprColumnContent';

export interface AprColumnProps {
  readonly ammPool: AmmPool;
}

export const AprColumn: FC<AprColumnProps> = ({ ammPool }) => (
  <Flex>
    <DataTag
      content={
        <>
          <IsErgo>
            <ErgoAprColumnContent ammPool={ammPool} />
          </IsErgo>
          <IsCardano>
            <ErgoAprColumnContent ammPool={ammPool} />
          </IsCardano>
        </>
      }
    />
  </Flex>
);
