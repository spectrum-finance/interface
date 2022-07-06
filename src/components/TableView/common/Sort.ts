import { DateTime } from 'luxon';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Sort {
  direction: SortDirection | undefined;
  column: number;
}

export type SortValueSelector<T> = (item: T) => string | number | DateTime;
