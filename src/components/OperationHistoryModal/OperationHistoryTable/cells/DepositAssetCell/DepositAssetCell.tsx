import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Currency } from '../../../../../common/models/Currency';
import { AssetIconPair } from '../../../../AssetIconPair/AssetIconPair';
import { DataTag } from '../../../../common/DataTag/DataTag';

export interface SwapAssetCellProps {
  readonly x: Currency;
  readonly y: Currency;
}

export const DepositAssetCell: FC<SwapAssetCellProps> = ({ x, y }) => (
  <Box transparent padding={2} width={188} borderRadius="m" secondary>
    <Flex col>
      <Flex.Item display="flex" marginBottom={1}>
        <Flex.Item marginRight={2}>
          <AssetIconPair assetX={x.asset} assetY={y.asset} size="small" />
        </Flex.Item>
        <Typography.Title level={5}>
          {x.asset.ticker}/{y.asset.ticker}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item display="flex">
        <Flex.Item marginRight={2}>
          <DataTag
            content={x.toString(Math.max(x.asset.decimals || 0, 2), 2)}
            size="small"
          />
        </Flex.Item>
        <Flex.Item>
          <DataTag
            content={y.toString(Math.max(y.asset.decimals || 0, 2), 2)}
            size="small"
          />
        </Flex.Item>
      </Flex.Item>
    </Flex>
  </Box>
);
