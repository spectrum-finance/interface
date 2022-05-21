import React from 'react';

import { Currency } from '../../../../common/models/Currency';
import { Box, Flex, Typography } from '../../../../ergodex-cdk';
import { AssetIcon } from '../../../AssetIcon/AssetIcon';
import { UsdView } from '../../../UsdView/UsdView';

interface TokenListItemProps {
  readonly currency: Currency;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({ currency }) => (
  <Box padding={[2, 4]} bordered={false}>
    <Flex align="center">
      <Flex.Item flex={1}>
        <Flex align="center">
          <Flex.Item marginRight={2}>
            <AssetIcon asset={currency.asset} />
          </Flex.Item>
          <Flex direction="col">
            <Typography.Body>{currency.asset.name}</Typography.Body>
          </Flex>
        </Flex>
      </Flex.Item>
      <Flex col align="flex-end">
        <Flex.Item>
          <Typography.Body>{currency.toString()}</Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Footnote>
            <UsdView value={currency} prefix="~" />
          </Typography.Footnote>
        </Flex.Item>
      </Flex>
    </Flex>
  </Box>
);
