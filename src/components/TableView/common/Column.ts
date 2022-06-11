import { ReactNode } from 'react';

import { Filter } from './FilterDescription';
import { SortDirection, SortValueSelector } from './Sort';

export interface Column<T> {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: (item: T) => ReactNode | ReactNode[] | string;
  readonly flex?: number;
  readonly width?: number;
  readonly filter?: Filter<T, any>;
  readonly sortBy?: SortValueSelector<T>;
  readonly defaultDirection?: SortDirection;
  readonly headerWidth?: number | string;
}
