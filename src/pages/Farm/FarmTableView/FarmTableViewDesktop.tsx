import { Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
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
  openStakeModal: (pool: AmmPool) => void;
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
        {(ammPool) => <FarmPairColumn ammPool={ammPool} status="Scheduled" />}
      </TableView.Column>

      <TableView.Column width={140} title={<Trans>Total Staked</Trans>}>
        {/*{(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).tvl} />}*/}
        {(ammPool) => (
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
        {/*{(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).volume} />}*/}
        {(ammPool) => (
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
        {/*{(ammPool: AmmPool) => <AprColumn ammPool={poolMapper(ammPool)} />}*/}
        {/*{(ammPool) => <Progress percent={90} />}*/}
        {(ammPool) => <LineProgress percent={60} height={24} width="130px" />}
      </TableView.Column>
      <TableView.Column width={140} title={<Trans>APY</Trans>}>
        {/*{(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).volume} />}*/}
        {(ammPool) => (
          <Flex>
            <DataTag content={<div>30%</div>} />
          </Flex>
        )}
      </TableView.Column>
      <TableView.Column width={160} title={<Trans>Actions</Trans>}>
        {/*{(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).volume} />}*/}
        {(ammPool) => (
          <Button
            type="primary"
            onClick={(event) => {
              console.log(ammPool);
              openStakeModal(ammPool);
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
