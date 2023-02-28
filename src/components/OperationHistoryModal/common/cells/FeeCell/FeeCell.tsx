import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Currency } from '../../../../../common/models/Currency';
import { Operation } from '../../../../../common/models/Operation';
import { networkAsset } from '../../../../../network/ergo/api/networkAsset/networkAsset';
import { AssetIcon } from '../../../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../../ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../InfoTooltip/InfoTooltip';

export interface FeeCellProps {
  readonly operation: Operation;
}

export const FeeCell: FC<FeeCellProps> = ({ operation }) => (
  <Flex justify="flex-start">
    <Box padding={[0, 1]} bordered={false} borderRadius="s">
      <InfoTooltip
        secondary
        content={
          <Flex align="center">
            <Flex.Item marginRight={1}>
              <AssetIcon size="extraSmall" asset={networkAsset} />
            </Flex.Item>
            <Typography.Body size="small">
              {new Currency(20000000n, networkAsset).toCurrencyString()}
            </Typography.Body>
          </Flex>
        }
        width={300}
      >
        <Typography.Body size="small">
          <ConvenientAssetView value={new Currency(20000000n, networkAsset)} />
        </Typography.Body>
      </InfoTooltip>
    </Box>
  </Flex>
);
