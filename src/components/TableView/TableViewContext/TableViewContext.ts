import { createContext, useContext } from 'react';

import { Dictionary } from '../../../common/utils/Dictionary';
import { Action } from '../common/Action';
import { Column } from '../common/Column';
import { State } from '../common/State';

export interface TableViewContext<T> {
  readonly columns: Column<T>[];
  readonly states: Dictionary<State<T>>;
  readonly actions: Action<T>[];
  readonly addState: (s: State<T>) => void;
  readonly addColumn: (c: Column<T>) => void;
  readonly addAction: (a: Action<T>) => void;
}

export const TableViewContext = createContext<TableViewContext<any>>({
  columns: [],
  states: {},
  actions: [],
  addColumn: () => {},
  addState: () => {},
  addAction: () => {},
});

export const useTableViewContext = (): TableViewContext<any> =>
  useContext(TableViewContext);
