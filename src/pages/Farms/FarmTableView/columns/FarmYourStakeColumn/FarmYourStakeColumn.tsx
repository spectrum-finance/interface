import { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { FarmTagColumn } from '../common/FarmTagColumn/FarmTagColumn';

export interface FarmYourStakeColumnPops {
  readonly farm: Farm;
  readonly sensitive?: boolean;
}

export const FarmYourStakeColumn: FC<FarmYourStakeColumnPops> = ({
  farm,
  sensitive,
}) => (
  <FarmTagColumn
    x={farm.yourStakeX}
    y={farm.yourStakeY}
    sensitive={sensitive}
  />
);
