import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { AssetIcon } from '../../../../../components/AssetIcon/AssetIcon';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';

export interface FarmAprColumnProps {
  readonly farm: Farm;
}

export const FarmAprColumn: FC<FarmAprColumnProps> = ({ farm }) => {
  if (!farm.apr) {
    return <Typography.Body size="large">$---</Typography.Body>;
  }

  return (
    <Flex>
      <DataTag
        size="large"
        content={
          <Flex align="center">
            <Flex.Item marginRight={1}>
              <AssetIcon asset={farm.reward.asset} size="extraSmall" />
            </Flex.Item>
            {farm.apr}%
          </Flex>
        }
      />
    </Flex>
  );
};
