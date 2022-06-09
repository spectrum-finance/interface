import React, { FC } from 'react';
import styled from 'styled-components';

import { FilterFilled } from '../../../ergodex-cdk';

export interface FilterIconProps {
  readonly className?: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

const _FilterIcon: FC<FilterIconProps> = ({ className, onClick }) => (
  <FilterFilled className={className} onClick={onClick} />
);

export const FilterIcon = styled(_FilterIcon)`
  color: ${(props) =>
    props.active
      ? 'var(--ergo-primary-color)'
      : 'var(--ergo-table-list-column-icon)'};
  cursor: pointer;
  font-size: 12px;
`;
