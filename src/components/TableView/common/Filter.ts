export interface Filter<T> {
  readonly value?: T;
  readonly onChange?: (t: T) => void;
}

export interface FilterControlProps<T> {
  readonly value?: T;
  readonly onChange?: (t: T) => void;
  readonly close: () => void;
}

export interface FilterState<T> {
  readonly opened: boolean;
  readonly value: T[keyof T];
}
