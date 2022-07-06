import { Flex, Gutter, Popover, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Dictionary } from '../../../common/utils/Dictionary';
import { Column } from '../common/Column';
import { BORDER_HEIGHT } from '../common/constants';
import { FilterState } from '../common/FilterDescription';
import { Sort, SortDirection } from '../common/Sort';
import { FilterButton } from '../FilterButton/FilterButton';
import { SortButton } from '../SortButton/SortButton';
import { TableViewRow } from '../TableViewRow/TableViewRow';
import { TableViewRowRenderer } from '../TableViewRowRenderer/TableViewRowRenderer';

export interface TableViewHeaderProps {
  readonly height: number;
  readonly columns: Column<any>[];
  readonly padding?: Gutter;
  readonly filtersState: Dictionary<FilterState<any>>;
  readonly toggleFilterVisibility: (i: number) => void;
  readonly changeFilter: (i: number, value: any) => void;
  readonly sort: Sort | undefined;
  readonly changeSort: (i: number, value: SortDirection | undefined) => void;
}

export const TableViewHeader: FC<TableViewHeaderProps> = ({
  height,
  columns,
  padding,
  filtersState,
  toggleFilterVisibility,
  changeFilter,
  sort,
  changeSort,
}) => (
  <TableViewRowRenderer height={height} padding={0}>
    <TableViewRow height={height - BORDER_HEIGHT} padding={padding}>
      {columns.map((c, i) => (
        <TableViewRow.Column
          key={i}
          width={c.headerWidth || c.width}
          maxWidth={c.headerMaxWidth || c.maxWidth}
          minWidth={c.headerMinWidth || c.minWidth}
        >
          <Flex align="center" style={{ userSelect: 'none' }}>
            <Typography.Body>{c.title}</Typography.Body>
            {c.sortBy && (
              <Flex.Item marginLeft={1}>
                <SortButton
                  direction={sort?.column === i ? sort.direction : undefined}
                  changeDirection={changeSort.bind(null, i)}
                />
              </Flex.Item>
            )}
            {c.filter && (
              <Flex.Item marginLeft={2}>
                <Popover
                  trigger="click"
                  content={c.filter.render({
                    value: filtersState[i]?.value,
                    onChange: changeFilter.bind(null, i),
                  })}
                  placement="bottomRight"
                  visible={filtersState[i]?.opened}
                  onVisibleChange={() => toggleFilterVisibility(i)}
                >
                  <FilterButton
                    active={filtersState[i]?.opened || filtersState[i]?.value}
                  />
                </Popover>
              </Flex.Item>
            )}
          </Flex>
        </TableViewRow.Column>
      ))}
    </TableViewRow>
  </TableViewRowRenderer>
);
