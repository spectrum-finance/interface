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
      <Flex.Item display="flex" col flex={1}>
        <Flex.Item display="flex" align="center">
          <Flex.Item flex={1}>
            <Typography.Body>
              <Truncate>{currency.asset.ticker}</Truncate>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item display="flex" justify="flex-end">
            <Typography.Body>{currency.toString()}</Typography.Body>
          </Flex.Item>
        </Flex.Item>
        <Flex.Item display="flex" align="center">
          <Flex.Item flex={1}>
            <Typography.Footnote>
              <Truncate>{currency.asset.name}</Truncate>
            </Typography.Footnote>
          </Flex.Item>
          <Flex.Item display="flex" justify="flex-end">
            <Typography.Footnote>
              <ConvenientAssetView value={currency} prefix="~" />
            </Typography.Footnote>
          </Flex.Item>
        </Flex.Item>
      </Flex.Item>
    </Flex>
  </Box>
);
