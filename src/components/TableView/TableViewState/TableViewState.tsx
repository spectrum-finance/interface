import React, { FC, useEffect } from 'react';

import { State } from '../common/State';
import { useTableViewContext } from '../TableViewContext/TableViewContext';

export const TableViewState: FC<State<any>> = (state) => {
  const { addState } = useTableViewContext();

  useEffect(() => {
    addState(state);
  }, [state.condition]);

  return null;
};
