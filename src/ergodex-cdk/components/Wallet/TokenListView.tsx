import './TokenListView.less';

import React from 'react';

import { TokenListItem } from './TokenListItem';

interface TokenListItem {
  symbol: string;
  name: string;
  iconName?: string;
}
interface TokenListViewProps {
  tokenList: TokenListItem[];
}

export const TokenListView: React.FC<TokenListViewProps> = ({ tokenList }) => {
  return (
    <div className="token-list">
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
