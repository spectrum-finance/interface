import { ReactNode } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Position } from '../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../components/TableView/common/Expand';

export interface LiquidityPoolOrPositionDetailsProps<
  T extends AmmPool | Position,
> extends ExpandComponentProps<T> {
  poolMapper: (item: T) => AmmPool;
  children?: ReactNode | ReactNode[] | string;
}
