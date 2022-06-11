import { ReactNode } from 'react';

import { Filter, FilterMatch } from './Filter';
import { SortDirection, SortValueSelector } from './Sort';

export interface Column<T> {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: (item: T) => ReactNode | ReactNode[] | string;
  readonly flex?: number;
  readonly width?: number;
  readonly filter?: (
    config: Filter<T[keyof T]>,
  ) => ReactNode | ReactNode[] | string;
  readonly filterMatch?: FilterMatch<T>;
  readonly sortBy?: SortValueSelector<T>;
  readonly defaultDirection?: SortDirection;
  readonly headerWidth?: number | string;
}
