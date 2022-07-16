import { Box, Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../../../../../common/models/AssetInfo';
import { AssetIcon } from '../../../../../../AssetIcon/AssetIcon';
import { Truncate } from '../../../../../../Truncate/Truncate';

interface AssetListExtendedSearchItemProps {
  asset: AssetInfo;
  className?: string;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const AssetName = styled(Typography.Footnote)`
  font-size: 10px;
  line-height: 15px;
`;

const _AssetListExtendedSearchItem: React.FC<AssetListExtendedSearchItemProps> =
  ({ asset, onClick, className, height }) => (
    <Box
      height={height}
      className={className}
      borderRadius="m"
      padding={[0, 4]}
      bordered={false}
    >
      <Flex align="center" width="100%">
        <Flex.Item marginRight={2} align="center">
          <AssetIcon asset={asset} size="large" />
        </Flex.Item>
        <Flex.Item col display="flex" justify="center">
          <Typography.Title level={4}>
            <Truncate limit={20}>{asset.ticker}</Truncate>
          </Typography.Title>
          <AssetName>{asset.name}</AssetName>
        </Flex.Item>
        <Flex.Item flex={1} justify="flex-end">
          <Button type="primary" onClick={onClick}>
            <Trans>Import</Trans>
          </Button>
        </Flex.Item>
      </Flex>
    </Box>
  );

export const AssetListExtendedSearchItem = styled(_AssetListExtendedSearchItem)`
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: var(--ergo-dark-card-background);
  }
`;
