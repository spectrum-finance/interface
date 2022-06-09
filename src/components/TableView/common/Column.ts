import { ReactNode } from 'react';

import { Filter, FilterMatch } from './Filter';

export interface Column<T> {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: (item: T) => ReactNode | ReactNode[] | string;
  readonly flex?: number;
  readonly width?: number;
  readonly filter?: (
    config: Filter<T[keyof T]>,
  ) => ReactNode | ReactNode[] | string;
  readonly match?: FilterMatch<T>;
  readonly headerWidth?: number | string;
}
