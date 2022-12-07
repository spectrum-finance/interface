import { Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { LmPool } from '../../../common/models/LmPool';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { ConvenientAssetView } from '../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { TableView } from '../../../components/TableView/TableView';
import { networkContext$ } from '../../../gateway/api/networkContext';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { FarmAction } from '../FarmAction/FarmAction';
import { APRComponent } from '../FarmApr/FarmApr';
import { FarmPairColumn } from '../FarmPairColumn/FarmPairColumn';
import { LineProgress } from '../LineProgress/LineProgress';
import { FarmTableLoadingState } from './FarmTableLoadingState';

type Props = {
  expandComponent: React.FC<ExpandComponentProps<any>>;
  items: LmPool[];
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
        width={270}
        headerWidth={262}
        title={<Trans>Pair</Trans>}
      >
        {(lmPool: LmPool) => <FarmPairColumn lmPool={lmPool} />}
      </TableView.Column>

      <TableView.Column width={140} title={<Trans>Total Staked</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).tvl} />}*/}
        {(lmPool: LmPool) => (
          <Flex>
            <DataTag
              content={
                <Flex gap={1} align="center">
                  {/* ${lmPool.shares}{' '} */}
                  <ConvenientAssetView value={lmPool.shares} />
                  <InfoTooltip
                    width={194}
                    size="small"
                    placement="top"
                    icon="exclamation"
                    content={
                      <div>
                        <div>
                          {lmPool.shares[0].asset.ticker}:{' '}
                          {lmPool.shares[0].toString()}
                        </div>
                        <div>
                          {lmPool.shares[1].asset.ticker}:{' '}
                          {lmPool.shares[1].toString()}
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
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).volume} />}*/}
        {(lmPool: LmPool) => (
          <Flex>
            <DataTag
              content={
                <div>
                  {lmPool.yourStake.every((value) => value.isPositive()) ? (
                    <ConvenientAssetView value={lmPool.yourStake} />
                  ) : (
                    <>$---</>
                  )}
                </div>
              }
            />
          </Flex>
        )}
      </TableView.Column>
      <TableView.Column
        width={150}
        title={
          <InfoTooltip
            width={194}
            placement="top"
            content={
              <Trans>
                345 Neta out of 1000 Neta have already been distributed
              </Trans>
            }
          >
            <Trans>Distributed</Trans>
          </InfoTooltip>
        }
      >
        {/*{(lmPool: LmPool) => <AprColumn lmPool={poolMapper(lmPool)} />}*/}
        {/*{(lmPool) => <Progress percent={90} />}*/}
        {(lmPool) => <LineProgress percent={60} height={24} width="130px" />}
      </TableView.Column>
      <TableView.Column width={140} title={<Trans>APR</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).volume} />}*/}
        {(lmPool: LmPool) => (
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
