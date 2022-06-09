import { createContext, useContext } from 'react';

import { Dictionary } from '../../../common/utils/Dictionary';
import { Column } from '../common/Column';
import { State } from '../common/State';

export interface TableViewContext<T> {
  readonly columns: Column<T>[];
  readonly states: Dictionary<State<T>>;
  readonly addState: (s: State<T>) => void;
  readonly addColumn: (c: Column<T>) => void;
}

export const TableViewContext = createContext<TableViewContext<any>>({
  columns: [],
  states: {},
  addColumn: () => {},
  addState: () => {},
});

export const useTableViewContext = (): TableViewContext<any> =>
  useContext(TableViewContext);
