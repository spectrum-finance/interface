import { SearchDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PairColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/PairColumn/PairColumn';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { PoolsOrPositionsTableViewProps } from '../../../common/types/PoolsOrPositionsTableViewProps';

export const PoolsOrPositionsTableView: FC<
  PoolsOrPositionsTableViewProps<any>
> = ({ children, poolMapper, items, expandComponent }) => (
  <TableView
    items={items}
    itemKey="id"
    itemHeight={68}
    maxHeight={376}
    gap={1}
    showHeader={false}
    tableItemViewPadding={2}
    expand={{ height: 328, accordion: true, component: expandComponent }}
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
