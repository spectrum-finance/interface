import { useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { Position } from '../../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../../components/TableView/common/Expand';
import { TableView } from '../../../../../components/TableView/TableView';
import { ActionsColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/ActionsColumn';
import { AprColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/AprColumn/AprColumn';
import { PairColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/PairColumn/PairColumn';
import { TvlOrVolume24Column } from '../../../common/columns/PoolsOrPositionsColumns/columns/TvlOrVolume24Column/TvlOrVolume24Column';
import { Apr24InfoTooltip } from '../../../common/components/Apr24InfoTooltip/Apr24InfoTooltip.tsx';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';

export interface PoolsOrPositionsTableViewProps<T extends AmmPool | Position> {
  readonly items: T[];
  readonly poolMapper: (item: T) => AmmPool;
  readonly expandComponent: FC<ExpandComponentProps<T>>;
}

export const PoolsOrPositionsTableView: FC<
  PropsWithChildren<PoolsOrPositionsTableViewProps<any>>
> = ({ children, poolMapper, items }) => {
  const { valBySize } = useDevice();
  const navigate = useNavigate();

  return (
    <TableView
      items={items}
      onItemClick={(item) => {
        navigate(poolMapper(item).id);
      }}
      itemKey="id"
      itemHeight={80}
      maxHeight="70vh"
      gap={1}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 4]}
    >
      <TableView.Column
        width={401}
        headerWidth={393}
        title={<Trans>Pair</Trans>}
      >
        {(ammPool) => <PairColumn ammPool={poolMapper(ammPool)} />}
      </TableView.Column>
      <TableView.Column
        width={valBySize(128, 128, 128)}
        title={<Trans>TVL</Trans>}
      >
        {(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).tvl} />}
      </TableView.Column>
      <TableView.Column
        width={valBySize(128, 128, 128)}
        title={<Trans>Volume 24h</Trans>}
      >
        {(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).volume} />}
      </TableView.Column>
      <TableView.Column
        width={valBySize(128, 128, 158)}
        title={
          <Apr24InfoTooltip>
            <Trans>APR 24h</Trans>
          </Apr24InfoTooltip>
        }
      >
        {(ammPool: AmmPool) => <AprColumn ammPool={poolMapper(ammPool)} />}
      </TableView.Column>
      <TableView.Column width={valBySize(20, 20, 200)}>
        {(ammPool) => <ActionsColumn ammPool={poolMapper(ammPool)} />}
      </TableView.Column>
      {children}
      <TableView.State name="search" condition={!items.length}>
        <LiquiditySearchState />
      </TableView.State>
    </TableView>
  );
};
