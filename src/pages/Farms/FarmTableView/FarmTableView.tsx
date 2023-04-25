import { useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { Farm } from '../../../common/models/Farm';
import { Position } from '../../../common/models/Position';
import { TableView } from '../../../components/TableView/TableView';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { FarmActionColumn } from './columns/FarmActionColumn/FarmActionColumn';
import { FarmAprColumn } from './columns/FarmAprColumn/FarmAprColumn';
import { FarmDistributedColumn } from './columns/FarmDistributedColumn/FarmDistributedColumn';
import { FarmPairColumn } from './columns/FarmPairColumn/FarmPairColumn';
import { FarmTotalStakedColumn } from './columns/FarmTotalStakedColumn/FarmTotalStakedColumn';
import { FarmYourStakeColumn } from './columns/FarmYourStakeColumn/FarmYourStakeColumn';
import { FarmTableExpandComponent } from './FarmTableExpandComponent/FarmTableExpandComponent';
import { FarmTableLoadingState } from './FarmTableLoadingState';

export interface FarmTableViewProps<T extends Farm | Position> {
  readonly items: T[];
  readonly loading?: boolean;
  readonly className?: string;
}

export const FarmTableView: FC<FarmTableViewProps<any>> = ({
  items,
  loading,
}) => {
  const { moreThan, valBySize } = useDevice();

  return (
    <TableView
      items={items}
      itemKey="id"
      itemHeight={80}
      maxHeight="calc(100vh - 340px)"
      gap={2}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 4]}
      expand={{
        columnWidth: 32,
        height: valBySize(462, 222, 222, 160),
        accordion: true,
        component: FarmTableExpandComponent,
      }}
      expandPadding={[0, 0]}
    >
      <TableView.Column
        width={valBySize(238, 293)}
        headerWidth={valBySize(230, 285)}
        title={<Trans>Pair</Trans>}
      >
        {(farm) => <FarmPairColumn farm={farm} />}
      </TableView.Column>

      <TableView.Column
        width={140}
        title={<Trans>Total Staked</Trans>}
        show={moreThan('xl')}
      >
        {(farm) => <FarmTotalStakedColumn farm={farm} />}
      </TableView.Column>
      <TableView.Column
        width={140}
        title={<Trans>Your Stake</Trans>}
        show={moreThan('xl')}
      >
        {(farm) => <FarmYourStakeColumn farm={farm} />}
      </TableView.Column>
      <TableView.Column
        show={moreThan('m')}
        width={valBySize(153, 153, 248, 208)}
        title={<Trans>Distributed</Trans>}
      >
        {(farm) => <FarmDistributedColumn farm={farm} />}
      </TableView.Column>
      <TableView.Column
        flex={valBySize(1, undefined)}
        width={valBySize(undefined, 140)}
        title={<Trans>APR</Trans>}
      >
        {(farm) => <FarmAprColumn farm={farm} />}
      </TableView.Column>
      <TableView.Column flex={1} title="" show={moreThan('m')}>
        {(farm) => <FarmActionColumn farm={farm} />}
      </TableView.Column>
      <TableView.State name="loading" condition={loading}>
        <FarmTableLoadingState />
      </TableView.State>
      <TableView.State name="search" condition={!items.length}>
        <LiquiditySearchState />
      </TableView.State>
    </TableView>
  );
};
