import React, { FC } from 'react';

import { Currency } from '../../../../../../common/models/Currency';
import { Box, Flex, Typography } from '../../../../../../ergodex-cdk';
import { AssetIcon } from '../../../../../AssetIcon/AssetIcon';
import { DataTag } from '../../../../../common/DataTag/DataTag';

interface AssetBoxProps {
  readonly currency: Currency;
  readonly className?: string;
}

export const AssetBox: FC<AssetBoxProps> = ({ currency, className }) => (
  <Box padding={[1, 2]} className={className} transparent>
    <Flex align="center">
      <Flex.Item marginRight={1}>
        <AssetIcon size="small" asset={currency.asset} />
      </Flex.Item>
      <Flex.Item marginRight={1} flex={1}>
        <Typography.Title level={5}>{currency.asset.name}</Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <DataTag
          content={currency.toString(currency.asset.decimals, 2)}
          size="small"
        />
      </Flex.Item>
    </Flex>
  </Box>
);
