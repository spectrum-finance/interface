import { Box, Button, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AssetInfo } from '../../../../../../../common/models/AssetInfo';
import { exploreToken } from '../../../../../../../gateway/utils/exploreAddress';
import { AssetIcon } from '../../../../../../AssetIcon/AssetIcon';
import { Truncate } from '../../../../../../Truncate/Truncate';

export interface ImportTokenInfoProps {
  readonly asset: AssetInfo;
}

export const ImportTokenInfo: FC<ImportTokenInfoProps> = ({ asset }) => (
  <Box control padding={[4, 0]}>
    <Flex col align="center">
      <Flex.Item marginBottom={2}>
        <AssetIcon asset={asset} size="large" />
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={4}>
          {asset.ticker || asset.name}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Footnote>{asset.name}</Typography.Footnote>
      </Flex.Item>
      <Button type="link" onClick={() => exploreToken(asset)}>
        <Truncate limit={46}>{asset.id}</Truncate>
      </Button>
    </Flex>
  </Box>
);
