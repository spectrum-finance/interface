import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as CheckedIcon } from '../../assets/icons/checked-icon.svg';
import { Box } from '../../ergodex-cdk';

interface ListItemWrapper {
  className?: string;
  isActive?: boolean;
  children?: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
}

const _ActiveIcon: FC<{ className?: string }> = ({ className }) => (
  <CheckedIcon className={className} />
);

const ActiveIcon = styled(_ActiveIcon)`
  position: absolute;
  top: calc(var(--ergo-base-gutter) * 2);
  right: calc(var(--ergo-base-gutter) * 2);
  color: var(--ergo-primary-color);
`;

const _ListItemWrapper: FC<ListItemWrapper> = ({
  className,
  children,
  onClick,
  isActive,
}) => {
  return (
    <Box
      control
      onClick={onClick}
      className={className}
      padding={4}
      borderRadius="m"
    >
      {isActive && <ActiveIcon />}
      {children}
    </Box>
  );
};

export const ListItemWrapper = styled(_ListItemWrapper)`
  background: var(--ergo-pool-position-bg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover,
  &:focus,
  &:active {
    background: var(--ergo-pool-position-bg-hover);
  }

  ${(props) => props.isActive && 'border: 1px solid var(--ergo-primary-color);'}
`;
