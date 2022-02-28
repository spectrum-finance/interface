import './ListItemWrapper.less';

import React, { FC } from 'react';

import { ReactComponent as CheckedIcon } from '../../assets/icons/checked-icon.svg';
import { Box } from '../../ergodex-cdk';

interface ListItemWrapper {
  isActive?: boolean;
  children?: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
}

const ListItemWrapper: FC<ListItemWrapper> = ({
  isActive,
  children,
  onClick,
}) => {
  return (
    <Box
      control
      onClick={onClick}
      // className={cn('ergodex-list-item-wrapper', {
      //   'ergodex-list-item-wrapper--active': isActive,
      // })}
      padding={4}
      borderRadius="m"
    >
      {isActive && <CheckedIcon className="ergodex-list-item-wrapper__icon" />}
      {children}
    </Box>
  );
};

export { ListItemWrapper };
