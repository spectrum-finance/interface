import { CSSProperties, ReactNode } from 'react';

import { Filter } from './FilterDescription';
import { SortDirection, SortValueSelector } from './Sort';

export interface Column<T> {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: (item: T) => ReactNode | ReactNode[] | string;
  readonly flex?: number;
  readonly width?: CSSProperties['width'];
  readonly maxWidth?: CSSProperties['maxWidth'];
  readonly minWidth?: CSSProperties['minWidth'];
  readonly filter?: Filter<T, any>;
  readonly sortBy?: SortValueSelector<T>;
  readonly defaultDirection?: SortDirection;
  readonly headerWidth?: CSSProperties['width'];
  readonly headerMaxWidth?: CSSProperties['maxWidth'];
  readonly headerMinWidth?: CSSProperties['minWidth'];
  readonly show?: boolean;
}
