import React, { FC } from 'react';

import { Flex, List, Menu } from '../../../ergodex-cdk';
import { Gutter } from '../../../ergodex-cdk/utils/gutter';
import { OptionsButton } from '../../common/OptionsButton/OptionsButton';
import { Action } from '../common/Action';
import { Column } from '../common/Column';
import { TableItemView } from '../TableItemView/TableListItemView';

export interface TableViewContentProps<T> {
  readonly itemKey: T[keyof T];
  readonly items: T[];
  readonly maxHeight?: number;
  readonly itemHeight: number;
  readonly height?: number;
  readonly gap?: number;
  readonly padding?: Gutter;
  readonly columns: Column<any>[];
  readonly actions: Action<any>[];
  readonly actionsWidth?: number;
}

export const TableViewContent: FC<TableViewContentProps<any>> = ({
  maxHeight,
  height,
  itemKey,
  items,
  gap,
  itemHeight,
  padding,
  columns,
  actions,
  actionsWidth,
}) => (
  <List
    rowKey={itemKey}
    dataSource={items}
    maxHeight={maxHeight}
    height={height}
    gap={gap}
  >
    {(item) => (
      <TableItemView height={itemHeight} padding={padding}>
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
        {actions?.length && (
          <TableItemView.Column flex={1}>
            <Flex stretch align="center" justify="flex-end">
              <OptionsButton size="middle" width={actionsWidth}>
                {actions.map((a, i) => {
                  const Decorator = a.decorator;

                  return Decorator ? (
                    <Decorator item={item}>
                      <Menu.Item
                        key={i}
                        icon={a.icon}
                        onClick={() => a.onClick && a.onClick(item)}
                      >
                        {a.children}
                      </Menu.Item>
                    </Decorator>
                  ) : (
                    <Menu.Item
                      key={i}
                      icon={a.icon}
                      onClick={() => a.onClick && a.onClick(item)}
                    >
                      {a.children}
                    </Menu.Item>
                  );
                })}
              </OptionsButton>
            </Flex>
          </TableItemView.Column>
        )}
      </TableItemView>
    )}
  </List>
);
