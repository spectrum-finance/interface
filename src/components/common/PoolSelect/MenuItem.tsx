import './MenuItem.less';

import React from 'react';

import { Box, Typography } from '../../../ergodex-cdk';
import { TokenIcon } from '../../TokenIcon/TokenIcon';

interface MenuItemProps {
  firstTokenName?: string | null;
  secondTokenName?: string | null;
  percentage: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  firstTokenName,
  secondTokenName,
  percentage,
}) => (
  // <Box
  //   className="menu-item"
  //   onClick={onClick}
  //   borderRadius="m"
  //   padding={[1, 2]}
  // >
  //   <TokenIcon
  //     name={firstTokenName ?? 'empty'}
  //     className="menu-item__icon-left"
  //   />
  //   <TokenIcon
  //     name={secondTokenName ?? 'empty'}
  //     className="menu-item__icon-right"
  //   />
  //   <Box className="menu-item__box-left" padding={0}>
  //     <Typography.Text className="menu-item__box-left-symbol">
  //       {firstTokenName}/{secondTokenName}
  //     </Typography.Text>
  //   </Box>
  //   <Box className="menu-item__box" padding={0}>
  //     <Typography.Text className="menu-item__box-percent">
  //       {percentage}%
  //     </Typography.Text>
  //   </Box>
  // </Box>
  <Box className="menu-item" borderRadius="m" padding={[1, 3]}>
    <TokenIcon
      name={firstTokenName ?? 'empty'}
      className="menu-item__icon-left"
    />
    <TokenIcon
      name={secondTokenName ?? 'empty'}
      className="menu-item__icon-right"
    />
    <Box className="menu-item__box-left" padding={0}>
      <Typography.Text className="menu-item__box-left-symbol">
        {firstTokenName}/{secondTokenName}
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
