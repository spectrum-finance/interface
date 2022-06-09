import React, { FC, ReactNode, useEffect } from 'react';

import { Column } from '../common/Column';
import { useTableViewContext } from '../TableViewContext/TableViewContext';

export const TableViewColumn: FC<Column<any>> = (column) => {
  const { addColumn } = useTableViewContext();

  useEffect(() => {
    addColumn(column);
  }, []);

  return null;
};
