import './TokenListView.less';

import React from 'react';

import { Space, Typography } from '../../ergodex-cdk';
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
  <div className="token-list-item-wrapper">
    <TokenIcon name={iconName ?? symbol ?? 'empty'} />
    <Space className="token-name-balance">
      <Space direction="vertical" size={0}>
        <Typography.Text strong style={{ fontSize: '16px' }}>
          {symbol}
        </Typography.Text>
        <Typography.Text style={{ fontSize: '10px' }} className="token-name">
          {name}
        </Typography.Text>
      </Space>
      <Typography.Text
        strong
        style={{ fontSize: '16px' }}
        className="token-balance"
      >
        {balance}
      </Typography.Text>
    </Space>
  </div>
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
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      {tokenList.map((token, key) => (
        <TokenListItem
          key={key}
          symbol={token.symbol}
          name={token.name}
          iconName={token.iconName}
          balance={21.065}
        />
      ))}
    </Space>
  );
};
