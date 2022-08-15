import { FC, ReactNode } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Position } from '../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../components/TableView/common/Expand';

export interface PoolsOrPositionsTableViewProps<T extends AmmPool | Position> {
  readonly items: T[];
  readonly poolMapper: (item: T) => AmmPool;
  readonly expandComponent: FC<ExpandComponentProps<T>>;
  readonly children?: ReactNode | ReactNode[] | string;
}
