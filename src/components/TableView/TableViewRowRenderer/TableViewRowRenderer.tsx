import { Box } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { RowRendererProps } from '../common/RowRenderer';

const _TableViewRowRenderer: FC<RowRendererProps & { className?: string }> = ({
  children,
  padding,
  height,
  className,
}) => (
  <Box padding={padding} height={height} className={className}>
    {children}
  </Box>
);

export const TableViewRowRenderer = styled(_TableViewRowRenderer)`
  overflow: hidden;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  background: var(--spectrum-table-view-item-bg);
  width: 100%;

  ${(props) =>
    props.hoverable &&
    css`
      cursor: pointer;

      &:hover,
      &:focus,
      &:active {
        background: var(--spectrum-table-view-item-hover);
      }
    `}
`;
