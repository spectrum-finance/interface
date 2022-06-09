import React, { FC } from 'react';
import styled from 'styled-components';

import { FilterFilled } from '../../../ergodex-cdk';

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
        : 'var(--ergo-table-list-column-icon)'};
    font-size: 12px;
  }
`;
