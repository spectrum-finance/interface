import { Flex } from '@ergolabs/ui-kit';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { Dictionary } from '../../common/utils/Dictionary';
import { Gutter } from '../../ergodex-cdk/utils/gutter';
import { Action } from './common/Action';
import { Column } from './common/Column';
import { GAP_STEP, HEADER_HEIGHT } from './common/constants';
import { FilterState } from './common/FilterDescription';
import { filterItem } from './common/filterItem';
import { Sort, SortDirection } from './common/Sort';
import { sortItems } from './common/sortItems';
import { State } from './common/State';
import { TableViewAction } from './TableViewAction/TableViewAction';
import { TableViewColumn } from './TableViewColumn/TableViewColumn';
import { TableViewContent } from './TableViewContent/TableViewContent';
import { TableViewContext } from './TableViewContext/TableViewContext';
import { TableViewHeader } from './TableViewHeader/TableViewHeader';
import { TableViewState } from './TableViewState/TableViewState';

export interface TableViewProps<T> {
  readonly actionsWidth?: number;
  readonly maxHeight?: number;
  readonly height?: number;
  readonly items: T[];
  readonly itemKey: keyof T;
  readonly gap?: number;
  readonly itemHeight: number;
  readonly tablePadding?: Gutter;
  readonly tableItemViewPadding?: Gutter;
  readonly tableHeaderPadding?: Gutter;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly emptyFilterView?: ReactNode | ReactNode[] | string;
}

const getDefaultSort = (columns: Column<any>[]): Sort | undefined => {
  const defaultSortColumnIndex = columns.findIndex((c) => c.defaultDirection);

  return defaultSortColumnIndex !== -1
    ? {
        column: defaultSortColumnIndex,
        direction: columns[defaultSortColumnIndex].defaultDirection,
      }
    : undefined;
};

const _TableView: FC<TableViewProps<any>> = ({
  actionsWidth,
  maxHeight,
  items,
  height,
  itemKey,
  tableItemViewPadding,
  gap,
  tableHeaderPadding,
  tablePadding,
  itemHeight,
  children,
  emptyFilterView,
}) => {
  const [states, setStates] = useState<Dictionary<State<any>>>({});
  const [columns, setColumns] = useState<Column<any>[]>([]);
  const [actions, setActions] = useState<Action<any>[]>([]);
  const [sort, setSort] = useState<Sort | undefined>();
  const [filtersState, setFiltersState] = useState<
    Dictionary<FilterState<any>>
  >({});

  useEffect(() => {
    setSort(getDefaultSort(columns));
  }, [columns]);

  const addState = (s: State<any>) =>
    setStates((prev) => ({
      ...prev,
      [s.name]: s,
    }));

  const addColumn = (c: Column<any>) => setColumns((prev) => prev.concat(c));

  const addAction = (a: Action<any>) => setActions((prev) => prev.concat(a));

  const changeSort = (column: number, direction: SortDirection | undefined) => {
    setSort(
      direction
        ? {
            column,
            direction,
          }
        : undefined,
    );
  };

  const changeFilter = (index: number, value: any | undefined) => {
    setFiltersState((prev) => ({
      ...prev,
      [index]: { ...prev[index], value },
    }));
  };

  const toggleFilterVisibility = (index: number) => {
    setFiltersState((prev) => ({
      ...prev,
      [index]: { ...prev[index], opened: !prev[index]?.opened },
    }));
  };

  const currentState: State<any> | undefined = Object.values(states).find(
    (s) => s.condition,
  );

  const contentHeight = height
    ? height - HEADER_HEIGHT - GAP_STEP * (gap || 0)
    : height;
  const contentMaxHeight = maxHeight
    ? maxHeight - HEADER_HEIGHT - GAP_STEP * (gap || 0)
    : maxHeight;
  const completedItems = sortItems(
    sort,
    columns,
    items.filter((item) =>
      columns.every((c, i) => filterItem(item, c, i, filtersState)),
    ),
  );

  return (
    <>
      <TableViewContext.Provider
        value={{ states, columns, actions, addState, addColumn, addAction }}
      >
        {children}
      </TableViewContext.Provider>
      <Flex col>
        <Flex.Item marginBottom={gap}>
          <TableViewHeader
            height={HEADER_HEIGHT}
            columns={columns}
            padding={tableHeaderPadding || tablePadding}
            toggleFilterVisibility={toggleFilterVisibility}
            filtersState={filtersState}
            changeFilter={changeFilter}
            sort={sort}
            changeSort={changeSort}
          />
        </Flex.Item>
        {currentState &&
          (currentState.children instanceof Function
            ? currentState.children(items)
            : currentState.children)}
        {!currentState &&
          emptyFilterView &&
          !completedItems.length &&
          emptyFilterView}
        {!currentState && !!completedItems.length && (
          <TableViewContent
            columns={columns}
            padding={tableItemViewPadding || tablePadding}
            maxHeight={contentMaxHeight}
            height={contentHeight}
            items={completedItems}
            gap={gap}
            itemHeight={itemHeight}
            itemKey={itemKey}
            actions={actions}
            actionsWidth={actionsWidth}
          />
        )}
      </Flex>
    </>
  );
};

export const TableView: typeof _TableView & {
  Column: typeof TableViewColumn;
  State: typeof TableViewState;
  Action: typeof TableViewAction;
} = _TableView as any;

TableView.Column = TableViewColumn;
TableView.State = TableViewState;
TableView.Action = TableViewAction;
