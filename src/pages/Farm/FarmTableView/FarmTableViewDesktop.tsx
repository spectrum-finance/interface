import { Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { LmPool } from '../../../common/models/LmPool';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { TableView } from '../../../components/TableView/TableView';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { FarmPairColumn } from '../FarmPairColumn/FarmPairColumn';
import { LineProgress } from '../LineProgress/LineProgress';
import { FarmTableLoadingState } from './FarmTableLoadingState';

type Props = {
  expandComponent: React.FC<ExpandComponentProps<any>>;
  items: any;
  openStakeModal: (pool: LmPool) => void;
  loading: boolean | undefined;
};

export const FarmTableViewDesktop = ({
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
        {(lmPool) => <FarmPairColumn lmPool={lmPool} status="Scheduled" />}
      </TableView.Column>

      <TableView.Column width={140} title={<Trans>Total Staked</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).tvl} />}*/}
        {(lmPool) => (
          <Flex>
            <DataTag
              content={
                <Flex gap={1} align="center">
                  $340k{' '}
                  <InfoTooltip
                    width={194}
                    size="small"
                    placement="top"
                    icon="exclamation"
                    content={
                      <div>
                        <div>ERG: 314,756.66</div>
                        <div>SFP: 314,756.66</div>
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
        {(lmPool) => (
          <Flex>
            <DataTag content={<div>$---</div>} />
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
      <TableView.Column width={140} title={<Trans>APY</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).volume} />}*/}
        {(lmPool) => (
          <Flex>
            <DataTag content={<div>30%</div>} />
          </Flex>
        )}
      </TableView.Column>
      <TableView.Column width={160} title={<Trans>Actions</Trans>}>
        {/*{(lmPool) => <TvlOrVolume24Column usd={poolMapper(lmPool).volume} />}*/}
        {(lmPool) => (
          <Button
            type="primary"
            onClick={(event) => {
              openStakeModal(lmPool);
              event.stopPropagation();
            }}
          >
            Stake
          </Button>
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
