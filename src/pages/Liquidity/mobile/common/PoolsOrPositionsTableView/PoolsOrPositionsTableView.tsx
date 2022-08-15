import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PairColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/PairColumn/PairColumn';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { PoolsOrPositionsTableViewProps } from '../../../common/types/PoolsOrPositionsTableViewProps';

export const PoolsOrPositionsTableView: FC<
  PoolsOrPositionsTableViewProps<any> & { expandHeight: number }
> = ({ children, poolMapper, items, expandComponent, expandHeight }) => (
  <TableView
    items={items}
    itemKey="id"
    itemHeight={68}
    maxHeight="calc(100vh - 338px)"
    gap={1}
    showHeader={false}
    tableItemViewPadding={2}
    expand={{
      height: expandHeight,
      accordion: true,
      component: expandComponent,
    }}
  >
    <TableView.Column flex={1} title={<Trans>Pair</Trans>}>
      {(ammPool) => <PairColumn ammPool={poolMapper(ammPool)} />}
    </TableView.Column>
    {children}
    <TableView.State name="search" condition={!items.length}>
      <LiquiditySearchState />
    </TableView.State>
  </TableView>
);
