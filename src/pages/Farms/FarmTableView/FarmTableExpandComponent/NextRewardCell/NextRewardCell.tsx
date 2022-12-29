import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { RewardCell } from '../common/RewardCell/RewardCell';

export interface NextRewardCellProps {
  readonly farm: Farm;
}

export const NextRewardCell: FC<NextRewardCellProps> = ({ farm }) => {
  return <RewardCell farm={farm} />;
};
