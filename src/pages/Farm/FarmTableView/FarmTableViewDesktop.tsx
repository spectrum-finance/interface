import { Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import numeral from 'numeral';
import React from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { Farm } from '../../../common/models/Farm';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { ConvenientAssetView } from '../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { TableView } from '../../../components/TableView/TableView';
import { networkContext$ } from '../../../gateway/api/networkContext';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { APRComponent } from '../FarmApr/FarmApr';
import { FarmLineProgress } from '../FarmLineProgress/FarmLineProgress';
import { FarmPairColumn } from '../FarmPairColumn/FarmPairColumn';
import { LineProgress } from '../LineProgress/LineProgress';
import { FarmAction } from './FarmAction/FarmAction';
import { FarmTableLoadingState } from './FarmTableLoadingState';

type Props = {
  expandComponent: React.FC<ExpandComponentProps<any>>;
  items: Farm[];
  loading: boolean | undefined;
};

export const FarmTableViewDesktop = ({
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
        height: 168,
        accordion: true,
        component: expandComponent,
      }}
      expandPadding={[0, 0]}
    >
      <TableView.Column
        width={286}
        headerWidth={278}
        title={<Trans>Pair</Trans>}
      >
        {(lmPool: Farm) => <FarmPairColumn lmPool={lmPool} />}
      </TableView.Column>

      <TableView.Column width={140} title={<Trans>Total Staked</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).tvl} />}*/}
        {(lmPool: Farm) => (
          <Flex>
            <DataTag
              content={
                <Flex gap={1} align="center">
                  <ConvenientAssetView value={lmPool.totalStakedShares} />
                  <InfoTooltip
                    width={194}
                    size="small"
                    placement="top"
                    icon="exclamation"
                    content={
                      <div>
                        <div>
                          {lmPool.totalStakedX.asset.ticker}:{' '}
                          {lmPool.totalStakedX.toString()}
                        </div>
                        <div>
                          {lmPool.totalStakedY.asset.ticker}:{' '}
                          {lmPool.totalStakedY.toString()}
                        </div>
                      </div>
                    }
                  />
                </Flex>
              }
            />
          </Flex>
        )}
      </TableView.Column>
      <TableView.Column width={140} title={<Trans>Your Stake</Trans>}>
        {(lmPool: Farm) => (
          <Flex>
            <DataTag
              content={
                <div>
                  {lmPool.yourStakeShares.every((value) =>
                    value.isPositive(),
                  ) ? (
                    <ConvenientAssetView value={lmPool.yourStakeShares} />
                  ) : (
                    <>$---</>
                  )}
                </div>
              }
            />
          </Flex>
        )}
      </TableView.Column>
      <TableView.Column width={150} title={<Trans>Distributed</Trans>}>
        {(lmPool: Farm) => (
          <FarmLineProgress lmPool={lmPool} height={24} width="130px" />
        )}
      </TableView.Column>
      <TableView.Column width={140} title={<Trans>APR</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).volume} />}*/}
        {(lmPool: Farm) => (
          <Flex>
            <APRComponent lmPool={lmPool} />
          </Flex>
        )}
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
