import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';
import styled from 'styled-components';

import { useAssetsBalance } from '../../../../../../gateway/api/assetBalance';
import { AssetTitle } from '../../../../../AssetTitle/AssetTitle';

interface TokenListItemProps {
  asset: AssetInfo;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const _TokenListItem: React.FC<TokenListItemProps> = ({
  asset,
  onClick,
  className,
}) => {
  const [balance] = useAssetsBalance();

  return (
    <Box
      className={className}
      onClick={onClick}
      borderRadius="m"
      padding={[3, 4]}
      bordered={false}
    >
      <Flex align="center" width="100%">
        <AssetTitle asset={asset} size="large" level={4} gap={2} />
        <Flex.Item flex={1} justify="flex-end">
          <Typography.Title level={5}>
            {balance.get(asset).toString()}
          </Typography.Title>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const AssetListItem = styled(_TokenListItem)`
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: var(--ergo-dark-card-background);
  }
`;
