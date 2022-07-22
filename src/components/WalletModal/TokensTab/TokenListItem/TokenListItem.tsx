import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';

import { Currency } from '../../../../common/models/Currency';
import { AssetIcon } from '../../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../ConvenientAssetView/ConvenientAssetView';
import { Truncate } from '../../../Truncate/Truncate';

interface TokenListItemProps {
  readonly currency: Currency;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({ currency }) => (
  <Box padding={[0, 4]} height={64}>
    <Flex align="center" stretch>
      <Flex.Item marginRight={2}>
        <AssetIcon asset={currency.asset} />
      </Flex.Item>
      <Flex.Item display="flex" col justify="center">
        <Typography.Body>
          <Truncate limit={10}>{currency.asset.ticker}</Truncate>
        </Typography.Body>
        <Flex.Item flex={1}>
          <Typography.Footnote>{currency.asset.name}</Typography.Footnote>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item display="flex" col justify="center" flex={1} align="flex-end">
        <Typography.Body>{currency.toString()}</Typography.Body>
        <Typography.Footnote>
          <ConvenientAssetView value={currency} prefix="~" />
        </Typography.Footnote>
      </Flex.Item>
    </Flex>
  </Box>
);
