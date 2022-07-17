import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../../../../../common/models/AssetInfo';
import { useAssetsBalance } from '../../../../../../../gateway/api/assetBalance';
import { AssetIcon } from '../../../../../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../../../../ConvenientAssetView/ConvenientAssetView';
import { Truncate } from '../../../../../../Truncate/Truncate';

interface TokenListItemProps {
  asset: AssetInfo;
  className?: string;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const StyledFootnote = styled(Typography.Footnote)`
  font-size: 10px;
  line-height: 15px;
`;

const _AssetListItem: React.FC<TokenListItemProps> = ({
  asset,
  onClick,
  className,
  height,
}) => {
  const [balance] = useAssetsBalance();

  return (
    <Box
      height={height}
      className={className}
      onClick={onClick}
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
          <StyledFootnote>{asset.name}</StyledFootnote>
        </Flex.Item>
        <Flex.Item
          flex={1}
          align="flex-end"
          col
          display="flex"
          justify="center"
        >
          <Typography.Title level={5}>
            {balance.get(asset).toString()}
          </Typography.Title>
          <StyledFootnote>
            <ConvenientAssetView value={balance.get(asset)} prefix="~" />
          </StyledFootnote>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const AssetListItem = styled(_AssetListItem)`
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: var(--ergo-dark-card-background);
  }
`;
