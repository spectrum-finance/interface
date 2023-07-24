import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import * as React from 'react';

import { Currency } from '../../../../common/models/Currency';
import { AssetIcon } from '../../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../ConvenientAssetView/ConvenientAssetView';
import { SensitiveContent } from '../../../SensitiveContent/SensitiveContent.tsx';
import { Truncate } from '../../../Truncate/Truncate';

interface TokenListItemProps {
  readonly currency: Currency;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({ currency }) => (
  <Box padding={[0, 6]} height={64} secondary borderRadius="l">
    <Flex align="center" stretch>
      <Flex.Item marginRight={2}>
        <AssetIcon asset={currency.asset} />
      </Flex.Item>
      <Flex.Item display="flex" col justify="center">
        <Typography.Body size="large" strong>
          <Truncate limit={10}>{currency.asset.ticker}</Truncate>
        </Typography.Body>
        <Typography.Body size="small" secondary>
          {currency.asset.name}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item display="flex" col justify="center" flex={1} align="flex-end">
        <SensitiveContent>
          <Typography.Body strong>{currency.toString()}</Typography.Body>
        </SensitiveContent>
        <Typography.Body size="small" secondary>
          <ConvenientAssetView sensitive value={currency} />
        </Typography.Body>
      </Flex.Item>
    </Flex>
  </Box>
);
