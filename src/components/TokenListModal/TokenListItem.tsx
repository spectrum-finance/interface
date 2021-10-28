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
  <Box className="token-list-item" onClick={onClick} padding={[1, 2]}>
    <TokenIcon name={iconName ?? symbol ?? 'empty'} />
    <Box className="token-name-balance" padding={0}>
      <Box className="token-symbol-name" padding={0}>
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
