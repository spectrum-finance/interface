import './TokenListItem.less';

import React from 'react';

import { TokenIcon, Typography } from '../../ergodex-cdk/components';

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
        <Typography.Text className="token-symbol">{symbol}</Typography.Text>
        <Typography.Text className="token-name" type="secondary">
          {name}
        </Typography.Text>
      </div>
      <span className="token-balance">{balance}</span>
    </div>
  </div>
);

export { TokenListItem };
