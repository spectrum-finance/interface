import './TokenListView.less';

import React from 'react';

import { Box, Col, Row, Typography } from '../../ergodex-cdk';
import { TokenIcon } from '../TokenIcon/TokenIcon';

interface TokenListItemProps {
  symbol?: string;
  name?: string;
  iconName?: string;
  balance?: number;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({
  symbol,
  name,
  iconName,
  balance,
}) => (
  <Box
    padding={[2, 4, 1, 4]}
    borderRadius="m"
    className="token__list-item_wrapper"
  >
    <Row align="middle">
      <Col span={2}>
        <TokenIcon name={iconName ?? symbol ?? 'empty'} />
      </Col>
      <Col span={18} style={{ paddingLeft: 10 }}>
        <Row>
          <Typography.Text strong style={{ fontSize: '16px' }}>
            {symbol}
          </Typography.Text>
        </Row>
        <Row align="bottom">
          <Typography.Text style={{ fontSize: '10px' }} className="token-name">
            {name}
          </Typography.Text>
        </Row>
      </Col>
      <Col span={4}>
        <Typography.Text strong style={{ fontSize: '16px', float: 'right' }}>
          {balance}
        </Typography.Text>
      </Col>
    </Row>
  </Box>
);

interface TokenItem {
  symbol: string;
  name: string;
  iconName?: string;
}
interface TokenListViewProps {
  tokenList: TokenItem[];
}

export const TokenListView: React.FC<TokenListViewProps> = ({ tokenList }) => {
  return (
    <Row topGutter={1}>
      {tokenList.map((token, key) => (
        <Col span={24} key={key}>
          <TokenListItem
            symbol={token.symbol}
            name={token.name}
            iconName={token.iconName}
            balance={21.065}
          />
        </Col>
      ))}
    </Row>
  );
};
