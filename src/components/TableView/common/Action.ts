import { ReactNode } from 'react';

export interface Action<T> {
  readonly children?: ReactNode | ReactNode[] | string;
  readonly icon?: ReactNode | ReactNode[] | string;
  readonly onClick?: (item: T) => void;
  readonly decorate?: (
    children: ReactNode | ReactNode[] | string,
    item: T,
  ) => ReactNode | ReactNode[] | string;
}
