import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';
import { AssetIcon } from '../../../../../components/AssetIcon/AssetIcon';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';

export interface FarmAprColumnProps {
  readonly farm: Farm;
}

export const FarmAprColumn: FC<FarmAprColumnProps> = ({ farm }) => {
  return (
    <Flex>
      <DataTag
        size="large"
        content={
          <Flex align="center">
            <Flex.Item marginRight={1}>
              <AssetIcon asset={farm.reward.asset} size="extraSmall" />
            </Flex.Item>
            {farm.status !== FarmStatus.Live ? '--' : ''}
            {farm.status === FarmStatus.Live ? (
              <>{farm.apr ? `${farm.apr}%` : `< 0.01%`}</>
            ) : (
              ''
            )}
          </Flex>
        }
      />
    </Flex>
  );
};
