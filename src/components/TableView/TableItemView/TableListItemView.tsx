import { Box, Flex } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { Gutter } from '../../../ergodex-cdk/utils/gutter';
import { Column } from './Column/Column';

export interface TableItemViewProps {
  readonly height: number;
  readonly padding?: Gutter;
  readonly className?: string;
  readonly hoverable?: boolean;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly onClick?: () => void;
}

const _TableItemView: FC<TableItemViewProps> = ({
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

export const TableItemView: typeof _TableItemView & {
  Column: typeof Column;
} = styled(_TableItemView)`
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  background: var(--ergo-table-view-item-bg);
  width: 100%;

  ${(props) =>
    props.hoverable &&
    css`
      cursor: pointer;
      &:hover,
      &:focus,
      &:active {
        background: var(--ergo-table-view-item-hover);
      }
    `}
` as any;
TableItemView.Column = Column;
