import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { UsdCell } from '../common/UsdCell/UsdCell';

export interface TotalStakedCellProps {
  readonly farm: Farm;
}

export const TotalStakedCell: FC<TotalStakedCellProps> = ({ farm }) => (
  <UsdCell
    y={farm.totalStakedY}
    x={farm.totalStakedX}
    label={<Trans>Total staked</Trans>}
  />
);
