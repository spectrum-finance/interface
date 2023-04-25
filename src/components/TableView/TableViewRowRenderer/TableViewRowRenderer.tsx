import { Box } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { RowRendererProps } from '../common/RowRenderer';

const _TableViewRowRenderer: FC<RowRendererProps & { className?: string }> = ({
  children,
  padding,
  height,
  className,
}) => (
  <Box
    glass
    padding={padding}
    height={height}
    className={className}
    secondary
    borderRadius="l"
  >
    {children}
  </Box>
);

export const TableViewRowRenderer = styled(_TableViewRowRenderer)`
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
`;
