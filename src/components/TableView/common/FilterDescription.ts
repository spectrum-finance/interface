import { ReactNode } from 'react';

export interface FilterDescription<T> {
  readonly value?: Set<T> | undefined;
  readonly onChange?: (t: Set<T> | undefined) => void;
}

export interface FilterControlProps<T> extends FilterDescription<T> {
  readonly close?: () => void;
}

export interface FilterState<T> {
  readonly opened: boolean;
  readonly value: T[keyof T];
}

export type FilterRenderer<T> = (
  description: FilterDescription<T>,
) => ReactNode | ReactNode[] | string;

export type FilterMatch<T, K> = (filters: Set<K>, item: T) => boolean;

export interface Filter<T, K> {
  render: FilterRenderer<K>;
  match?: FilterMatch<T, K>;
  onFilterChange?: (filters: Set<K>) => void;
}
