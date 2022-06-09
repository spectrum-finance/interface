import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { SearchOutlined, Typography } from '../../../../ergodex-cdk';
import { TableViewStateContainer } from '../TableViewStateContainer/TableViewStateContainer';

export interface TableViewEmptySearchStateProps {
  readonly height: number;
  readonly children?: ReactNode | ReactNode[];
}

const SearchIcon = styled(SearchOutlined)`
  font-size: 40px;
  color: var(--ergo-table-list-icon);
`;

export const TableViewEmptySearchState: FC<TableViewEmptySearchStateProps> = ({
  height,
  children,
}) => (
  <TableViewStateContainer height={height} icon={<SearchIcon />}>
    <Typography.Body align="center">{children}</Typography.Body>
  </TableViewStateContainer>
);
