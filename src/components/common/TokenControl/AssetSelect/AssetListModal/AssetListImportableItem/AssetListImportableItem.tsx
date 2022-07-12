import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Box, Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import { importTokenAsset } from '../../../../../../gateway/api/assets';
import { AssetTitle } from '../../../../../AssetTitle/AssetTitle';

interface TokenListItemProps {
  asset: AssetInfo;
  className?: string;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const _AssetListImportableItem: React.FC<TokenListItemProps> = ({
  asset,
  onClick,
  className,
  height,
}) => {
  return (
    <Box
      height={height}
      className={className}
      onClick={onClick}
      borderRadius="m"
      padding={[3, 4]}
      bordered={false}
    >
      <Flex align="center" width="100%">
        <AssetTitle asset={asset} size="large" level={4} gap={2} />
        <Flex.Item flex={1} justify="flex-end">
          <Button type="primary" onClick={() => importTokenAsset(asset)}>
            <Trans>Import</Trans>
          </Button>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const AssetListImportableItem = styled(_AssetListImportableItem)`
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: var(--ergo-dark-card-background);
  }
`;
