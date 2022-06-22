import { Typography } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';

import { TableViewStateContainer } from '../TableViewStateContainer/TableViewStateContainer';
import { ReactComponent as EmptyIcon } from './empty.svg';

export interface TableViewEmptyStateProps {
  readonly height: number;
  readonly children?: ReactNode | ReactNode[];
}

export const TableViewEmptyState: FC<TableViewEmptyStateProps> = ({
  height,
  children,
}) => (
  <TableViewStateContainer height={height} icon={<EmptyIcon />} iconGutter={2}>
    <Typography.Body align="center">{children}</Typography.Body>
  </TableViewStateContainer>
);
