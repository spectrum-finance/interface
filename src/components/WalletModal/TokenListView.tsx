import './TokenListView.less';

import React from 'react';

import { TokenIcon } from '../../ergodex-cdk/components/TokenIcon/TokenIcon';

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
        <span className="token-symbol">{symbol}</span>
        <span className="token-name">{name}</span>
      </div>
      <span className="token-balance">{balance}</span>
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
