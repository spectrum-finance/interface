import './TokenListItem.less';

import React from 'react';

import { Box, Typography } from '../../ergodex-cdk/components';
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
  <Box className="token-list-item" onClick={onClick}>
    <TokenIcon name={iconName ?? symbol ?? 'empty'} />
    <Box className="token-name-balance">
      <Box className="token-symbol-name">
        <Typography.Text className="token-symbol">{symbol}</Typography.Text>
        <Typography.Text className="token-name" type="secondary">
          {name}
        </Typography.Text>
      </Box>
      <Typography.Text className="token-balance">{balance}</Typography.Text>
    </Box>
  </Box>
);

export { TokenListItem };
