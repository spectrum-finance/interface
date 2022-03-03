import './MenuItem.less';

import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';

import { Box, Typography } from '../../ergodex-cdk/components';
import { TokenIcon } from '../TokenIcon/TokenIcon';

interface MenuItemProps {
  fromToken?: AssetInfo;
  toTokenName?: AssetInfo;
  percentage?: number | null;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const MenuItem: React.FC<MenuItemProps> = ({
  fromToken,
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
    <TokenIcon asset={fromToken} />
    <TokenIcon asset={toTokenName} />
    <Box className="menu-item__box-left" padding={0}>
      <Typography.Text className="menu-item__box-left-symbol">
        {fromToken}/{toTokenName}
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
