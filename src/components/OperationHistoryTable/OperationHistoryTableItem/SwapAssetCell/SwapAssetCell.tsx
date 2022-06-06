import React, { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { ArrowRightOutlined, Flex, Typography } from '../../../../ergodex-cdk';
import { AssetIcon } from '../../../AssetIcon/AssetIcon';
import { DataTag } from '../../../common/DataTag/DataTag';

export interface SwapAssetCellProps {
  readonly base: Currency;
  readonly quote: Currency;
}

export const SwapAssetCell: FC<SwapAssetCellProps> = ({ base, quote }) => (
  <Flex align="center">
    <Flex.Item col marginRight={2}>
      <Flex.Item display="flex">
        <AssetIcon asset={base.asset} />
        <Flex.Item marginLeft={2}>
          <Typography.Title level={5}>{base.asset.name}</Typography.Title>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item display="inline-block">
        <DataTag content={base.toString(base.asset.decimals, 2)} size="small" />
      </Flex.Item>
    </Flex.Item>
    <Flex.Item marginRight={2}>
      <Typography.Body>
        <ArrowRightOutlined />
      </Typography.Body>
    </Flex.Item>
    <Flex.Item col>
      <Flex.Item display="flex">
        <AssetIcon asset={quote.asset} />
        <Flex.Item marginLeft={2}>
          <Typography.Title level={5}>{quote.asset.name}</Typography.Title>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item display="inline-block">
        <DataTag
          content={quote.toString(quote.asset.decimals, 2)}
          size="small"
        />
      </Flex.Item>
    </Flex.Item>
  </Flex>
);
