import { ReactNode } from 'react';

export interface State<T> {
  readonly name: string;
  readonly condition?: boolean;
  readonly children?:
    | ReactNode
    | ReactNode[]
    | string
    | ((items: T[]) => ReactNode | ReactNode[] | string);
}
