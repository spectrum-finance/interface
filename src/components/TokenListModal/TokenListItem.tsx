import './TokenListItem.less';

import React from 'react';

import { TokenIcon } from '../TokenIcon/TokenIcon';

interface TokenListItemProps {
  symbol?: string;
  name?: string;
  iconName?: string;
  balance?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const TokenListItem: React.FC<TokenListItemProps> = ({
  symbol,
  name,
  iconName,
  balance,
  onClick,
}) => (
  <div className="token-list-item" onClick={onClick}>
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

export { TokenListItem };
