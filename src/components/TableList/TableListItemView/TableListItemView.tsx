import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { Box, Flex } from '../../../ergodex-cdk';
import { Gutter } from '../../../ergodex-cdk/utils/gutter';
import { Column } from './Column/Column';

export interface TableListItemViewProps {
  readonly height: number;
  readonly padding?: Gutter;
  readonly className?: string;
  readonly hoverable?: boolean;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly onClick?: () => void;
}

const _TableListItemView: FC<TableListItemViewProps> = ({
  height,
  padding,
  className,
  children,
  onClick,
}) => (
  <Box
    height={height}
    padding={padding}
    className={className}
    onClick={onClick}
  >
    <Flex stretch>{children}</Flex>
  </Box>
);

export const TableListItemView: typeof _TableListItemView & {
  Column: typeof Column;
} = styled(_TableListItemView)`
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  background: var(--ergo-table-list-item-bg);
  width: 100%;

  ${(props) =>
    props.hoverable &&
    css`
      cursor: pointer;
      &:hover,
      &:focus,
      &:active {
        background: var(--ergo-table-list-item-hover);
      }
    `}
` as any;
TableListItemView.Column = Column;
