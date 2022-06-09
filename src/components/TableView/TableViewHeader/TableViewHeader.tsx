import React, { FC } from 'react';

import { Dictionary } from '../../../common/utils/Dictionary';
import { Flex, Popover, Typography } from '../../../ergodex-cdk';
import { Gutter } from '../../../ergodex-cdk/utils/gutter';
import { Column } from '../common/Column';
import { FilterState } from '../common/Filter';
import { FilterButton } from '../FilterButton/FilterButton';
import { TableItemView } from '../TableItemView/TableListItemView';

export interface TableViewHeaderProps {
  readonly height: number;
  readonly columns: Column<any>[];
  readonly padding?: Gutter;
  readonly filtersState: Dictionary<FilterState<any>>;
  readonly toggleFilter: (i: number) => void;
}

export const TableViewHeader: FC<TableViewHeaderProps> = ({
  height,
  columns,
  padding,
  filtersState,
  toggleFilter,
}) => (
  <TableItemView height={height} padding={padding}>
    {columns.map((c, i) => (
      <TableItemView.Column
        key={i}
        width={c.headerWidth || c.width}
        title={false}
        flex={c.flex}
      >
        <Flex align="center">
          <Typography.Body>{c.title}</Typography.Body>
          {c.filter && (
            <Flex.Item marginLeft={1}>
              <Popover
                trigger="click"
                content={c.filter({})}
                placement="bottomRight"
                visible={filtersState[i]?.opened}
                onVisibleChange={() => toggleFilter(i)}
              >
                <FilterButton active={filtersState[i]?.opened} />
              </Popover>
            </Flex.Item>
          )}
        </Flex>
      </TableItemView.Column>
    ))}
  </TableItemView>
);
