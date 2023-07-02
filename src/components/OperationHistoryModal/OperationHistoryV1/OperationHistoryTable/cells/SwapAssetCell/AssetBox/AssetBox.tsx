import { Box, Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../../../../../common/models/AssetInfo';
import { Currency } from '../../../../../../../common/models/Currency';
import { AssetPairTitle } from '../../../../../../AssetPairTitle/AssetPairTitle';
import { AssetTitle } from '../../../../../../AssetTitle/AssetTitle';
import { DataTag } from '../../../../../../common/DataTag/DataTag';
import { SensitiveContent } from '../../../../../../SensitiveContent/SensitiveContent.tsx';

interface AssetBoxProps {
  readonly currency: [AssetInfo, AssetInfo, Currency] | Currency;
  readonly className?: string;
}

const _AssetBox: FC<AssetBoxProps> = ({ currency, className }) => {
  const amount = currency instanceof Array ? currency[2] : currency;

  return (
    <Box padding={[1, 2]} className={className} borderRadius="m">
      <Flex align="center">
        <Flex.Item marginRight={1} flex={1}>
          {currency instanceof Array ? (
            <AssetPairTitle
              level={5}
              assetX={currency[0]}
              assetY={currency[1]}
              gap={1}
            >
              {currency[0].ticker}/{currency[1].ticker}
            </AssetPairTitle>
          ) : (
            <AssetTitle level={5} asset={currency.asset} gap={1} />
          )}
        </Flex.Item>
        <DataTag
          accent
          content={
            <SensitiveContent>
              {amount.toString(Math.max(amount.asset.decimals || 0, 2), 2)}
            </SensitiveContent>
          }
          size="extra-small"
        />
      </Flex>
    </Box>
  );
};

export const AssetBox = styled(_AssetBox)`
  border-color: var(--spectrum-asset-box-border-color);
`;
