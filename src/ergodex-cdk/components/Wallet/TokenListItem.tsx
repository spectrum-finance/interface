import './TokenListItem.less';

import React from 'react';

import { TokenIcon } from '..';

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
