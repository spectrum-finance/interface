import './TokenListItem.less';

import React from 'react';

import { Box, Typography } from '../../../../../ergodex-cdk/components';
import { TokenIcon } from '../../../../TokenIcon/TokenIcon';

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
  <Box
    className="token-item"
    onClick={onClick}
    borderRadius="m"
    padding={[1, 2]}
  >
    <TokenIcon name={iconName ?? symbol ?? 'empty'} />
    <Box className="token-item__box" padding={0}>
      <Box className="token-item__box-left" padding={0}>
        <Typography.Text className="token-item__box-left-symbol">
          {symbol}
        </Typography.Text>
        <Typography.Text className="token-item__box-left-name" type="secondary">
          {name}
        </Typography.Text>
      </Box>
      <Typography.Text className="token-item__box-balance">
        {balance}
      </Typography.Text>
    </Box>
  </Box>
);

export { TokenListItem };
