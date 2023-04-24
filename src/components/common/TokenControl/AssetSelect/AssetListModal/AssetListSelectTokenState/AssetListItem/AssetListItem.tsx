import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { AssetInfo } from '../../../../../../../common/models/AssetInfo';
import { useAssetsBalance } from '../../../../../../../gateway/api/assetBalance';
import { AssetIcon } from '../../../../../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../../../../ConvenientAssetView/ConvenientAssetView';
import { Truncate } from '../../../../../../Truncate/Truncate';

interface TokenListItemProps {
  asset: AssetInfo;
  active?: boolean;
  className?: string;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const _AssetListItem: React.FC<TokenListItemProps> = ({
  asset,
  onClick,
  className,
  height,
  active,
}) => {
  const [balance] = useAssetsBalance();

  return (
    <Box
      height={height}
      className={className}
      onClick={active ? undefined : onClick}
      borderRadius="l"
      padding={[0, 4]}
      secondary
      transparent
      bordered={false}
    >
      <Flex align="center" width="100%" stretch>
        <Flex.Item marginRight={2} align="center">
          <AssetIcon asset={asset} size="large" />
        </Flex.Item>
        <Flex.Item col display="flex" justify="center">
          <Typography.Title level={4}>
            <Truncate limit={20}>{asset.ticker}</Truncate>
          </Typography.Title>
          {asset.name && (
            <Typography.Body secondary size="small">
              {asset.name}
            </Typography.Body>
          )}
        </Flex.Item>

        <Flex.Item
          flex={1}
          align="flex-end"
          col
          display="flex"
          justify="center"
        >
          <Typography.Body strong size="large">
            {balance.get(asset).toString()}
          </Typography.Body>
          {!!Number(balance.get(asset).toAmount()) && (
            <Typography.Body secondary size="small">
              <ConvenientAssetView value={balance.get(asset)} />
            </Typography.Body>
          )}
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const AssetListItem = styled(_AssetListItem)`
  user-select: none;

  ${(props) =>
    props.active &&
    css`
      opacity: 0.4;
    `}
`;
