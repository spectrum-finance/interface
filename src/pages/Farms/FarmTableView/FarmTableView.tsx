import { Flex, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Farm } from '../../../common/models/Farm';
import { Position } from '../../../common/models/Position';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { ConvenientAssetView } from '../../../components/ConvenientAssetView/ConvenientAssetView';
import { TableView } from '../../../components/TableView/TableView';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { APRComponent } from '../FarmApr/FarmApr';
import { FarmLineProgress } from '../FarmLineProgress/FarmLineProgress';
import { FarmAprColumn } from './columns/FarmAprColumn/FarmAprColumn';
import { FarmDistributedColumn } from './columns/FarmDistributedColumn/FarmDistributedColumn';
import { FarmPairColumn } from './columns/FarmPairColumn/FarmPairColumn';
import { FarmTotalStakedColumn } from './columns/FarmTotalStakedColumn/FarmTotalStakedColumn';
import { FarmYourStakeColumn } from './columns/FarmYourStakeColumn/FarmYourStakeColumn';
import { FarmAction } from './FarmAction/FarmAction';
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
  const { moreThan } = useDevice();

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
        height: 168,
        accordion: true,
        component: FarmTableExpandComponent,
      }}
      expandPadding={[0, 0]}
    >
      <TableView.Column
        width={286}
        headerWidth={278}
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
      <TableView.Column width={192} title={<Trans>Distributed</Trans>}>
        {(farm) => <FarmDistributedColumn farm={farm} />}
      </TableView.Column>
      <TableView.Column width={140} title={<Trans>APR</Trans>}>
        {(farm) => <FarmAprColumn farm={farm} />}
      </TableView.Column>
      <TableView.Column width={160} title={<Trans>Actions</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).volume} />}*/}
        {(lmPool) => (
          <ConnectWalletButton
            size="middle"
            analytics={{ location: 'farm-table' }}
          >
            <FarmAction lmPool={lmPool} />
          </ConnectWalletButton>
        )}
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
