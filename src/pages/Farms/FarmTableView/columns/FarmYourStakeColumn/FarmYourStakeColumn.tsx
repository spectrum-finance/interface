import { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { FarmTagColumn } from '../common/FarmTagColumn/FarmTagColumn';

export interface FarmYourStakeColumnPops {
  readonly farm: Farm;
}

export const FarmYourStakeColumn: FC<FarmYourStakeColumnPops> = ({ farm }) => (
  <FarmTagColumn x={farm.yourStakeX} y={farm.yourStakeY} />
);
