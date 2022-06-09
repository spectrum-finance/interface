import React, { FC, useEffect } from 'react';

import { Action } from '../common/Action';
import { useTableViewContext } from '../TableViewContext/TableViewContext';

export const TableViewAction: FC<Action<any>> = (action) => {
  const { addAction } = useTableViewContext();

  useEffect(() => {
    addAction(action);
  }, []);

  return null;
};
