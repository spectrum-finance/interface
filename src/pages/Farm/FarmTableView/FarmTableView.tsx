import { Button, Flex, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
import { Position } from '../../../common/models/Position';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { TableView } from '../../../components/TableView/TableView';
import { LiquiditySearchState } from '../../Liquidity/common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { FarmPairColumn } from '../FarmPairColumn/FarmPairColumn';
import { FarmStakeModal } from '../FarmStakeModal/FarmStakeModal';
import { LineProgress } from '../LineProgress/LineProgress';
import { FarmTableLoadingState } from './FarmTableLoadingState';
import { FarmTableViewDesktop } from './FarmTableViewDesktop';
import { FarmTableViewLaptop } from './FarmTableViewLaptop';
import { FarmTableViewMobile } from './FarmTableViewMobile';
import { FarmTableViewTablet } from './FarmTableViewTablet';

export interface FarmTableViewProps<T extends AmmPool | Position> {
  readonly items: T[];
  // readonly poolMapper: (item: T) => AmmPool;
  readonly loading?: boolean;
  readonly expandComponent: FC<ExpandComponentProps<T>>;
  readonly className?: string;
}

export const FarmTableView: FC<FarmTableViewProps<any>> = ({
  items,
  expandComponent,
  // poolMapper,
  loading,
  className,
}) => {
  const { valBySize, moreThan, l, m, s } = useDevice();
  const openStakeModal = (pool: AmmPool) => {
    openConfirmationModal(
      (next) => {
        return <FarmStakeModal pool={pool} onClose={() => {}} />;
      },
      Operation.CREATE_FARM,
      {},
    );
    // panalytics.submitDeposit(value);
  };

  if (moreThan('xl')) {
    return (
      <FarmTableViewDesktop
        items={items}
        openStakeModal={openStakeModal}
        loading={loading}
        expandComponent={expandComponent}
      />
    );
  }

  if (l) {
    return (
      <FarmTableViewLaptop
        items={items}
        openStakeModal={openStakeModal}
        loading={loading}
        expandComponent={expandComponent}
      />
    );
  }

  if (m) {
    return (
      <FarmTableViewTablet
        items={items}
        openStakeModal={openStakeModal}
        loading={loading}
        expandComponent={expandComponent}
      />
    );
  }

  return (
    <FarmTableViewMobile
      items={items}
      openStakeModal={openStakeModal}
      loading={loading}
      expandComponent={expandComponent}
    />
  );
};
