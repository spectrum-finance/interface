import { SIZE, useDevice } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ExpandComponentProps } from '../../../../components/TableView/common/Expand';
import { ErgoFarm } from '../../../../network/ergo/lm/models/ErgoFarm';
import { ClaimedRewardsCell } from './ClaimedRewardsCell/ClaimedRewardsCell';
import { DistributionCell } from './DistributionCell/DistributionCell';
import { DistributionFrequencyCell } from './DistributionFrequencyCell/DistributionFrequencyCell';
import { FarmActionCell } from './FarmActionCell/FarmActionCell';
import { LivePeriodCell } from './LivePeriodCell/LivePeriodCell';
import { NextRewardCell } from './NextRewardCell/NextRewardCell';
import { TotalStakedCell } from './TotalStakedCell/TotalStakedCell';
import { YourStakeCell } from './YourStakeCell/YourStakeCell';

export interface FarmTableExpandComponentProps
  extends ExpandComponentProps<ErgoFarm> {
  readonly className?: string;
}

const _FarmTableExpandComponent: FC<FarmTableExpandComponentProps> = ({
  item,
  className,
}) => {
  const { lessThan } = useDevice();

  return (
    <div className={className}>
      {lessThan('m') && (
        <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <DistributionCell farm={item} />
        </div>
      )}
      {lessThan('l') && (
        <div>
          <TotalStakedCell farm={item} />
        </div>
      )}
      {lessThan('l') && (
        <div>
          <YourStakeCell farm={item} />
        </div>
      )}
      <div>
        <LivePeriodCell farm={item} />
      </div>
      <div>
        <NextRewardCell farm={item} />
      </div>
      <div>
        <DistributionFrequencyCell farm={item} />
      </div>
      <div>
        <ClaimedRewardsCell farm={item} />
      </div>
      <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
        {lessThan('m') && <FarmActionCell farm={item} />}
      </div>
    </div>
  );
};

export const FarmTableExpandComponent = styled(_FarmTableExpandComponent)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 80px 80px 118px 118px 72px;

  > * {
    border-bottom: 1px solid var(--spectrum-box-border-color-secondary);
    &:not(:nth-child(2n + 1)) {
      border-right: 1px solid var(--spectrum-box-border-color-secondary);
    }
  }

  @media (min-width: ${SIZE.m}px) {
    grid-template-rows: 1fr 1fr 1fr;

    > * {
      &:not(:nth-child(2n)) {
        border-right: 1px solid var(--spectrum-box-border-color-secondary);
      }
    }
  }

  @media (min-width: ${SIZE.xl}px) {
    grid-template-rows: 1fr 1fr;
  }

  height: 100%;
`;
