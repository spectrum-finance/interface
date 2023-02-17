import { FC, useEffect, useState } from 'react';

import { makeId } from '../../../common/utils/makeId';
import { Column } from '../common/Column';
import { useTableViewContext } from '../TableViewContext/TableViewContext';

export const TableViewColumn: FC<Column<any>> = (column) => {
  const [name] = useState<string>(makeId(10));
  const { addColumn } = useTableViewContext();

  useEffect(() => {
    addColumn({ ...column, name, show: column.show !== false });
  }, [column]);

  return null;
};
