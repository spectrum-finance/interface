import './TokensTab.less';

import React from 'react';

import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { getShortAddress } from '../../../utils/string/addres';
import { TokenIcon } from '../../TokenIcon/TokenIcon';
interface TokenListItemProps {
  token: string[];
}

interface TokenViewProps {
  token: string[];
}

const TokenView: React.FC<TokenViewProps> = ({ token }) => {
  return (
    <Flex alignItems="center">
      <Flex.Item marginRight={1}>
        <Typography.Text strong>{getShortAddress(token[0])}</Typography.Text>
      </Flex.Item>
    </Flex>
  );
};

const TokenListItem: React.FC<TokenListItemProps> = ({ token }) => {
  return (
    <Box padding={[2, 0]} transparent>
      <Flex alignItems="center" className="tokens-tab">
        <Flex.Item style={{ width: '45%', display: 'inline-flex' }}>
          <Flex>
            <Flex.Item marginRight={1} style={{ position: 'relative' }}>
              <TokenIcon name={token[0]} className="tokens-tab__icon" />
            </Flex.Item>
            <Flex.Item marginLeft={7}>
              <TokenView token={token} />
              <Typography.Text className="tokens-tab__text">
                {token[0]}
              </Typography.Text>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item grow>
          <Flex justify="flex-end">
            <Typography.Text strong className="tokens-tab__balance">
              {token[2]}
            </Typography.Text>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

interface TokenListViewProps {
  tokenList: string[][];
}

export const TokensTab: React.FC<TokenListViewProps> = ({ tokenList }) => {
  return (
    <Box transparent>
      <Flex flexDirection="col">
        <Flex.Item>
          <Box transparent maxHeight={250} overflow>
            {tokenList.map((item, index) => (
              <TokenListItem key={index} token={item} />
            ))}
          </Box>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
