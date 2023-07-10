import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { Currency } from '../../../../../../common/models/Currency';
import { AssetIconPair } from '../../../../../AssetIconPair/AssetIconPair';
import { DataTag } from '../../../../../common/DataTag/DataTag';
import { SensitiveContent } from '../../../../../SensitiveContent/SensitiveContent.tsx';

export interface SwapAssetCellProps {
  readonly x: Currency;
  readonly y: Currency;
  readonly hideAmount?: boolean;
  readonly className?: string;
}

const _DepositAssetCell: FC<SwapAssetCellProps> = ({
  x,
  y,
  className,
  hideAmount,
}) => (
  <Box padding={2} width={188} borderRadius="m" className={className}>
    <Flex col>
      <Flex.Item display="flex">
        <Flex.Item marginRight={2}>
          <AssetIconPair assetX={x.asset} assetY={y.asset} size="small" />
        </Flex.Item>
        <Typography.Title level={5}>
          {x.asset.ticker}/{y.asset.ticker}
        </Typography.Title>
      </Flex.Item>
      {!hideAmount && (
        <Flex.Item display="flex" marginTop={1}>
          <Flex.Item marginRight={2}>
            <DataTag
              content={
                <SensitiveContent>
                  {x.toString(Math.max(x.asset.decimals || 0, 2), 2)}
                </SensitiveContent>
              }
              size="small"
            />
          </Flex.Item>
          <Flex.Item>
            <DataTag
              content={
                <SensitiveContent>
                  {y.toString(Math.max(y.asset.decimals || 0, 2), 2)}
                </SensitiveContent>
              }
              size="small"
            />
          </Flex.Item>
        </Flex.Item>
      )}
    </Flex>
  </Box>
);

export const DepositAssetCell = styled(_DepositAssetCell)`
  border-color: var(--spectrum-asset-box-border-color);
`;
