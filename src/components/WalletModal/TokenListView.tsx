import './TokenListView.less';

import React from 'react';

import { Typography } from '../../ergodex-cdk';
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
    <div className="token-name-balance">
      <div className="token-symbol-name">
        <Typography.Text strong style={{ fontSize: '16px' }}>
          {symbol}
        </Typography.Text>
        <Typography.Text style={{ fontSize: '10px' }} className="token-name">
          {name}
        </Typography.Text>
      </div>
      <Typography.Text
        strong
        style={{ fontSize: '16px' }}
        className="token-balance"
      >
        {balance}
      </Typography.Text>
    </div>
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
    <div>
      {tokenList.map((token, key) => (
        <TokenListItem
          key={key}
          symbol={token.symbol}
          name={token.name}
          iconName={token.iconName}
          balance={21.065}
        />
      ))}
    </div>
  );
};
