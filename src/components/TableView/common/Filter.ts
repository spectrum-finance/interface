export interface Filter<T> {
  readonly value?: T | undefined;
  readonly onChange?: (t: T | undefined) => void;
}

export interface FilterControlProps<T> extends Filter<T> {
  readonly close: () => void;
}

export interface FilterState<T> {
  readonly opened: boolean;
  readonly value: T[keyof T];
}
