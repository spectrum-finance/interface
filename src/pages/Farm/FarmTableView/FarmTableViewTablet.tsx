import { Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { LmPool } from '../../../common/models/LmPool';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { TableView } from '../../../components/TableView/TableView';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { FarmAction } from '../FarmAction/FarmAction';
import { APRComponent } from '../FarmApr/FarmApr';
import { FarmLineProgress } from '../FarmLineProgress/FarmLineProgress';
import { FarmPairColumn } from '../FarmPairColumn/FarmPairColumn';
import { FarmTableLoadingState } from './FarmTableLoadingState';

type Props = {
  expandComponent: React.FC<ExpandComponentProps<any>>;
  items: LmPool[];
  loading: boolean | undefined;
};
export const FarmTableViewTablet = ({
  items,
  expandComponent,
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
        height: 300,
        accordion: true,
        component: expandComponent,
      }}
      expandPadding={[0, 0]}
    >
      <TableView.Column
        minWidth={290}
        maxWidth={290}
        headerMinWidth={282}
        headerMaxWidth={282}
        title={<Trans>Pair</Trans>}
      >
        {(lmPool) => <FarmPairColumn lmPool={lmPool} />}
      </TableView.Column>

      <TableView.Column
        minWidth={132}
        maxWidth={132}
        title={<Trans>Distributed</Trans>}
      >
        {(lmPool) => (
          <FarmLineProgress lmPool={lmPool} height={24} width="100px" />
        )}
      </TableView.Column>
      <TableView.Column width="100%" title={<Trans>APR</Trans>}>
        {(lmPool) => (
          <Flex justify="space-between">
            <APRComponent lmPool={lmPool} />
            <Flex.Item marginRight={8}>
              <ConnectWalletButton
                size="middle"
                analytics={{ location: 'farm-table' }}
              >
                <FarmAction lmPool={lmPool} />
              </ConnectWalletButton>
            </Flex.Item>
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
