import { ReactNode } from 'react';

export interface ListState {
  readonly name: string;
  readonly condition: boolean;
  readonly children?: ReactNode | ReactNode[] | string;
}
