import './MenuItem.less';

import React from 'react';

import { Box, Typography } from '../../ergodex-cdk/components';
import { TokenIcon } from '../TokenIcon/TokenIcon';

interface MenuItemProps {
  fromTokenName?: string | null;
  toTokenName?: string | null;
  percentage?: number | null;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const MenuItem: React.FC<MenuItemProps> = ({
  fromTokenName,
  toTokenName,
  percentage,
  onClick,
}) => (
  <Box
    className="menu-item"
    onClick={onClick}
    borderRadius="m"
    padding={[1, 2]}
  >
    <TokenIcon name={fromTokenName ?? 'empty'} />
    <TokenIcon name={toTokenName ?? 'empty'} />
    <Box className="menu-item__box-left" padding={0}>
      <Typography.Text className="menu-item__box-left-symbol">
        {fromTokenName}/{toTokenName}
      </Typography.Text>
    </Box>
    <Box className="menu-item__box" padding={0}>
      <Typography.Text className="menu-item__box-percent">
        {percentage}%
      </Typography.Text>
    </Box>
  </Box>
);

export { MenuItem };
