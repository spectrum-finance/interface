import { FilterFilled } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

export interface FilterIconProps {
  readonly className?: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

const _FilterIcon: FC<FilterIconProps> = ({ className, onClick }) => (
  <button onClick={onClick} className={className}>
    <FilterFilled />
  </button>
);

export const FilterButton = styled(_FilterIcon)`
  background: transparent;
  border: none;
  outline: none;
  padding: 0;

  .anticon {
    cursor: pointer;
    color: ${(props) =>
      props.active
        ? 'var(--ergo-primary-color)'
        : 'var(--ergo-table-view-column-icon)'};
    font-size: 12px;
  }
`;
