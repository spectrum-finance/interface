import { ReactNode } from 'react';

export interface Column<T> {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: (item: T) => ReactNode | ReactNode[] | string;
  readonly flex?: number;
  readonly width?: number;
  readonly headerWidth?: number | string;
}
