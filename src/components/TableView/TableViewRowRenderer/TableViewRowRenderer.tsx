import { Box } from '@ergolabs/ui-kit';
import React from 'react';

import { RowRenderer } from '../common/RowRenderer';

export const TableViewRowRenderer: RowRenderer = ({
  children,
  padding,
  height,
}) => (
  <Box padding={padding} height={height}>
    {children}
  </Box>
);
