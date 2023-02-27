import { FC, useEffect, useState } from 'react';

import { makeId } from '../../../common/utils/makeId';
import { Action } from '../common/Action';
import { useTableViewContext } from '../TableViewContext/TableViewContext';

export const TableViewAction: FC<Action<any>> = (action) => {
  const [id] = useState(makeId(10));
  const { addAction } = useTableViewContext();

  useEffect(() => {
    addAction({ ...action, id });
  }, [action]);

  return null;
};
