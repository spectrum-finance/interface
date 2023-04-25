import { Animation, Flex, Gutter } from '@ergolabs/ui-kit';
import { CSSProperties, FC, ReactNode, useEffect, useState } from 'react';

import { uint } from '../../common/types';
import { Dictionary } from '../../common/utils/Dictionary';
import { normalizeMeasure } from '../List/utils/normalizeMeasure';
import { Action } from './common/Action';
import { Column } from './common/Column';
import { HEADER_HEIGHT } from './common/constants';
import { TableExpand } from './common/Expand';
import { FilterState } from './common/FilterDescription';
import { filterItem } from './common/filterItem';
import { RowRenderer, RowRendererProps } from './common/RowRenderer';
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
  readonly maxHeight?: CSSProperties['maxHeight'];
  readonly height?: CSSProperties['height'];
  readonly items: T[];
  readonly itemKey: keyof T;
  readonly gap?: number;
  readonly itemHeight: number;
  readonly tablePadding?: Gutter;
  readonly tableItemViewPadding?: Gutter;
  readonly tableHeaderPadding?: Gutter;
  readonly expandPadding?: Gutter;
  readonly headerRowRenderer?:
    | RowRenderer
    | ((props: RowRendererProps) => ReactNode | ReactNode[] | string);
  readonly itemRowRenderer?:
    | RowRenderer
    | ((props: RowRendererProps, item: T) => ReactNode | ReactNode[] | string);
  readonly children?: ReactNode | ReactNode[] | string;
  readonly emptyFilterView?: ReactNode | ReactNode[] | string;
  readonly showHeader?: boolean;
  readonly expand?: TableExpand<T>;
  readonly hoverable?: boolean;
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

const getContentHeight = (
  height: CSSProperties['height'] | undefined,
  headerHeight: number,
  gap: uint = 0,
): CSSProperties['height'] | undefined => {
  return height
    ? `calc(${normalizeMeasure(height)} - ${normalizeMeasure(
        headerHeight,
      )} - var(--spectrum-base-gutter) * ${gap || 0})`
    : height;
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
  expandPadding,
  itemHeight,
  children,
  emptyFilterView,
  itemRowRenderer,
  showHeader = true,
  expand,
  hoverable,
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

  const addColumn = (currentC: Column<any>) => {
    setColumns((prev) => {
      if (prev.some((c) => c.name === currentC.name)) {
        return prev.map((c) => (c.name === currentC.name ? currentC : c));
      }
      return prev.concat(currentC);
    });
  };

  const addAction = (a: Action<any>) =>
    setActions((prev) => {
      if (prev.some((i) => i.id === a.id)) {
        return prev.map((i) => (i.id === a.id ? a : i));
      } else {
        return prev.concat(a);
      }
    });

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
    const onFilterChange = columns[index]?.filter?.onFilterChange;
    if (onFilterChange) {
      onFilterChange(value);
    }
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

  const contentHeight = showHeader
    ? getContentHeight(height, HEADER_HEIGHT, gap)
    : height;
  const contentMaxHeight = showHeader
    ? getContentHeight(maxHeight, HEADER_HEIGHT, gap)
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
        {showHeader && (
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
        )}
        {currentState && (
          <Animation.FadeIn>
            {currentState.children instanceof Function
              ? currentState.children(items)
              : currentState.children}
          </Animation.FadeIn>
        )}
        {!currentState && emptyFilterView && !completedItems.length && (
          <Animation.FadeIn>{emptyFilterView}</Animation.FadeIn>
        )}
        {!currentState && !!completedItems.length && (
          <TableViewContent
            hoverable={hoverable}
            expand={expand}
            rowRenderer={itemRowRenderer}
            columns={columns}
            padding={tableItemViewPadding || tablePadding}
            expandPadding={
              expandPadding || tableItemViewPadding || tablePadding
            }
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
