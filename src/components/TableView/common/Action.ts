import { FC, ReactNode } from 'react';

export interface Action<T> {
  readonly id?: string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly icon?: ReactNode | ReactNode[] | string;
  readonly onClick?: (item: T) => void;
  readonly decorator?: FC<{
    item: T;
    children: ReactNode | ReactNode[] | string;
  }>;
}
