import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { UsdCell } from '../common/UsdCell/UsdCell';

export interface TotalStakedCellProps {
  readonly farm: Farm;
}

export const YourStakeCell: FC<TotalStakedCellProps> = ({ farm }) => (
  <UsdCell
    y={farm.yourStakeY}
    x={farm.yourStakeX}
    label={<Trans>Your stake</Trans>}
  />
);
