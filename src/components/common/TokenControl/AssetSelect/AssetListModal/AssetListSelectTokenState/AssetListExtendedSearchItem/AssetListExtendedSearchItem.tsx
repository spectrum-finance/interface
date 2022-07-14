import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Box, Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import { AssetTitle } from '../../../../../../AssetTitle/AssetTitle';

interface AssetListExtendedSearchItemProps {
  asset: AssetInfo;
  className?: string;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const _AssetListExtendedSearchItem: React.FC<AssetListExtendedSearchItemProps> =
  ({ asset, onClick, className, height }) => (
    <Box
      height={height}
      className={className}
      borderRadius="m"
      padding={[3, 4]}
      bordered={false}
    >
      <Flex align="center" width="100%">
        <AssetTitle asset={asset} size="large" level={4} gap={2} />
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
