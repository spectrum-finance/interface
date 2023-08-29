import { ReactNode } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Position } from '../../../../common/models/Position';

export interface PoolsOrPositionsTableViewProps<T extends AmmPool | Position> {
  readonly items: T[];
  readonly poolMapper: (item: T) => AmmPool;
  readonly children?: ReactNode | ReactNode[] | string;
}
