import { AssetInfo } from '@ergolabs/ergo-sdk';
import React, { useEffect } from 'react';

import { Box, Flex, Typography } from '../../../../ergodex-cdk';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';

interface TokenListItemProps {
  readonly asset: AssetInfo;
  readonly balance: number;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({
  asset,
  balance,
}) => (
  <Box padding={[2, 4]}>
    <Flex align="center">
      <Flex.Item flex={1}>
        <Flex align="center">
          <Flex.Item marginRight={2}>
            <TokenIcon name={asset.name} />
          </Flex.Item>
          <Flex direction="col">
            <Typography.Body>{asset.name}</Typography.Body>
            {/*<Typography.Footnote small>{asset.name}</Typography.Footnote>*/}
          </Flex>
        </Flex>
      </Flex.Item>
      <Typography.Body>
        {balance} {asset.name}
      </Typography.Body>
    </Flex>
  </Box>
);
