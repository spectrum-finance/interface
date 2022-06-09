import React, { FC, ReactNode, useState } from 'react';

import { Dictionary } from '../../common/utils/Dictionary';
import { Flex, List, Typography } from '../../ergodex-cdk';
import { Gutter } from '../../ergodex-cdk/utils/gutter';
import { Column } from './common/Column';
import { State } from './common/State';
import { TableItemView } from './TableItemView/TableListItemView';
import { TableViewColumn } from './TableViewColumn/TableViewColumn';
import { TableViewContext } from './TableViewContext/TableViewContext';
import { TableViewState } from './TableViewState/TableViewState';

export interface TableViewProps<T> {
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
}

const GAP_STEP = 4;

const _TableView: FC<TableViewProps<any>> = ({
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
}) => {
  const [states, setStates] = useState<Dictionary<State<any>>>({});
  const [columns, setColumns] = useState<Column<any>[]>([]);

  const addState = (s: State<any>) =>
    setStates((prev) => ({
      ...prev,
      [s.name]: s,
    }));

  const addColumn = (c: Column<any>) => setColumns((prev) => prev.concat(c));

  const currentState: State<any> | undefined = Object.values(states).find(
    (s) => s.condition,
  );

  const contentHeight = height ? height - 40 - GAP_STEP * (gap || 0) : height;
  const contentMaxHeight = maxHeight
    ? maxHeight - 40 - GAP_STEP * (gap || 0)
    : maxHeight;

  return (
    <>
      <TableViewContext.Provider
        value={{ states, columns, addState, addColumn }}
      >
        {children}
      </TableViewContext.Provider>
      <Flex col>
        <Flex.Item marginBottom={gap}>
          <TableItemView
            height={40}
            padding={tableHeaderPadding || tablePadding}
          >
            {columns.map((c, i) => (
              <TableItemView.Column
                key={i}
                width={c.headerWidth || c.width}
                title={false}
                flex={c.flex}
              >
                <Typography.Body>{c.title}</Typography.Body>
              </TableItemView.Column>
            ))}
          </TableItemView>
        </Flex.Item>
        {currentState &&
          (currentState.children instanceof Function
            ? currentState.children(items)
            : currentState.children)}
        {!currentState && (
          <List
            rowKey={itemKey}
            dataSource={items}
            maxHeight={contentMaxHeight}
            height={contentHeight}
            gap={gap}
          >
            {(item) => (
              <TableItemView
                height={itemHeight}
                padding={tableItemViewPadding || tablePadding}
              >
                {columns.map((c, i) => (
                  <TableItemView.Column
                    key={i}
                    width={c.width}
                    title={false}
                    flex={c.flex}
                  >
                    {c.children ? c.children(item) : null}
                  </TableItemView.Column>
                ))}
              </TableItemView>
            )}
          </List>
        )}
      </Flex>
    </>
  );
};

export const TableView: typeof _TableView & {
  Column: typeof TableViewColumn;
  State: typeof TableViewState;
} = _TableView as any;

TableView.Column = TableViewColumn;
TableView.State = TableViewState;
