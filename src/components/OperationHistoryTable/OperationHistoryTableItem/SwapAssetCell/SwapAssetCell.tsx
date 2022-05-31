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
      <Flex.Item display="flex" marginBottom={1}>
        <AssetIcon asset={base.asset} />
        <Flex.Item marginLeft={2}>
          <Typography.Title level={5}>{base.asset.name}</Typography.Title>
        </Flex.Item>
      </Flex.Item>
      <DataTag content={base.toString()} size="small" secondary />
    </Flex.Item>
    <Flex.Item marginRight={2}>
      <Typography.Body>
        <ArrowRightOutlined />
      </Typography.Body>
    </Flex.Item>
    <Flex.Item col>
      <Flex.Item display="flex" marginBottom={1}>
        <AssetIcon asset={quote.asset} />
        <Flex.Item marginLeft={2}>
          <Typography.Title level={5}>{quote.asset.name}</Typography.Title>
        </Flex.Item>
      </Flex.Item>
      <DataTag content={quote.toString()} size="small" secondary />
    </Flex.Item>
  </Flex>
);
