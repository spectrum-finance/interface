import { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { FarmTagColumn } from '../common/FarmTagColumn/FarmTagColumn';

export interface FarmTotalStakedColumnProps {
  readonly farm: Farm;
}

export const FarmTotalStakedColumn: FC<FarmTotalStakedColumnProps> = ({
  farm,
}) => <FarmTagColumn x={farm.totalStakedX} y={farm.totalStakedY} />;
