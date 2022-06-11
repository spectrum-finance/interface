import React, { FC } from 'react';
import styled from 'styled-components';

import { CaretDownOutlined, CaretUpOutlined, Flex } from '../../../ergodex-cdk';
import { SortDirection } from '../common/Sort';

export interface SortButtonProps {
  readonly direction: SortDirection | undefined;
  readonly changeDirection: (direction: SortDirection | undefined) => void;
  readonly className?: string;
}

const _SortButton: FC<SortButtonProps> = ({
  className,
  changeDirection,
  direction,
}) => {
  const handleClick = () => {
    if (direction === SortDirection.DESC) {
      changeDirection(SortDirection.ASC);
      return;
    }
    if (direction === SortDirection.ASC) {
      changeDirection(undefined);
      return;
    }
    changeDirection(SortDirection.DESC);
  };

  return (
    <Flex col className={className} onClick={handleClick}>
      <CaretUpOutlined />
      <CaretDownOutlined />
    </Flex>
  );
};

export const SortButton = styled(_SortButton)`
  cursor: pointer;

  .anticon:first-child {
    color: ${(props) =>
      props.direction === SortDirection.ASC && 'var(--ergo-primary-color)'};
  }

  .anticon:last-child {
    color: ${(props) =>
      props.direction === SortDirection.DESC && 'var(--ergo-primary-color)'};
  }

  .anticon {
    color: var(--ergo-table-list-column-icon);
    font-size: 10px;
  }
`;
