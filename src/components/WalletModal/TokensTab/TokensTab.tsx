import './TokensTab.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import React, { useState } from 'react';

import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { TokenIcon } from '../../TokenIcon/TokenIcon';
interface TokenListItemProps {
  asset: AssetInfo;
  iconName?: string;
}

interface TokenViewProps {
  asset: AssetInfo;
}

const TokenView: React.FC<TokenViewProps> = ({ asset }) => {
  return (
    <Flex alignItems="center">
      <Flex.Item marginRight={1}>
        <Typography.Text strong>{asset.name}</Typography.Text>
      </Flex.Item>
    </Flex>
  );
};

const TokenListItem: React.FC<TokenListItemProps> = ({ asset }) => {
  return (
    <Box padding={[2, 0]} transparent>
      <Flex id={asset.name} alignItems="center" className="tokens-tab">
        <Flex.Item flex={1}>
          <Flex>
            <Flex.Item marginRight={1} style={{ position: 'relative' }}>
              <TokenIcon name={asset.name} className="tokens-tab__icon" />
            </Flex.Item>
            <Flex.Item marginLeft={7}>
              <TokenView asset={asset} />
              <Typography.Text className="tokens-tab__text">
                {asset.name}
              </Typography.Text>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item grow>
          <Flex justify="flex-end">
            <Typography.Text strong className="tokens-tab__balance">
              {asset.decimals} {asset.name}
            </Typography.Text>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

interface TokenListViewProps {
  readonly assets?: AssetInfo[];
}

export const TokensTab: React.FC<TokenListViewProps> = ({ assets }) => {
  const [searchWords, setSearchWords] = useState('');
  const byTerm = (asset: AssetInfo) =>
    !searchWords || asset.name?.toLowerCase().includes(searchWords);
  return (
    <Box transparent>
      <Flex flexDirection="col">
        <Flex.Item>
          <Box transparent maxHeight={250} overflow>
            {assets?.filter(byTerm).map((asset) => (
              <TokenListItem
                key={asset.id}
                asset={asset}
                iconName={asset.name}
              />
            ))}
          </Box>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
