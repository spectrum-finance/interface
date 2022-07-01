import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as CheckedIcon } from '../../../assets/icons/checked-icon.svg';
import { RowRendererProps } from '../../TableView/common/RowRenderer';
import { TableViewRowRenderer } from '../../TableView/TableViewRowRenderer/TableViewRowRenderer';

const _ActiveIcon: FC<{ className?: string }> = ({ className }) => (
  <CheckedIcon className={className} />
);

const ActiveIcon = styled(_ActiveIcon)`
  position: absolute;
  top: calc(var(--ergo-base-gutter) * 2);
  right: calc(var(--ergo-base-gutter) * 2);
  color: var(--ergo-primary-color);
`;

export interface SelectableItemRowRendererProps extends RowRendererProps {
  readonly className?: string;
  readonly selected?: boolean;
  readonly onClick?: () => void;
}

const _SelectableItemRowRenderer: FC<SelectableItemRowRendererProps> = ({
  onClick,
  selected,
  children,
  ...rest
}) => (
  <div onClick={onClick}>
    <TableViewRowRenderer {...rest}>
      {selected && <ActiveIcon />}
      {children}
    </TableViewRowRenderer>
  </div>
);

export const SelectableItemRowRenderer = styled(_SelectableItemRowRenderer)`
  position: relative;
  ${(props) => props.selected && 'border: 1px solid var(--ergo-primary-color);'}
`;
