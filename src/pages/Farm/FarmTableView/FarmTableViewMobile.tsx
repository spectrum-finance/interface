import { Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { LmPool } from '../../../common/models/LmPool';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { TableView } from '../../../components/TableView/TableView';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { FarmPairColumn } from '../FarmPairColumn/FarmPairColumn';
import { FarmTableLoadingState } from './FarmTableLoadingState';

type Props = {
  expandComponent: React.FC<ExpandComponentProps<any>>;
  items: any;
  openStakeModal: (pool: LmPool) => void;
  loading: boolean | undefined;
};

export const FarmTableViewMobile = ({
  items,
  expandComponent,
  openStakeModal,
  loading,
}: Props) => {
  return (
    <TableView
      items={items}
      itemKey="id"
      itemHeight={80}
      maxHeight={600}
      gap={2}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 4]}
      expand={{
        height: 560,
        accordion: true,
        component: expandComponent,
      }}
      expandPadding={[0, 0]}
    >
      <TableView.Column
        minWidth="calc(100% - 60px)"
        headerMinWidth="calc(100% - 54px)"
        title={<Trans>Pair</Trans>}
      >
        {(lmPool) => (
          <FarmPairColumn
            lmPool={lmPool}
            status="Scheduled"
            direction="col"
            align="flex-start"
          />
        )}
      </TableView.Column>

      <TableView.Column maxWidth={60} title={<Trans>APY</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).volume} />}*/}
        {(lmPool) => (
          <Flex>
            <DataTag content={<div>30%</div>} />
          </Flex>
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
