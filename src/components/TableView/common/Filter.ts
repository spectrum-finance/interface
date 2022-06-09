export interface Filter<T> {
  readonly value?: T;
  readonly onChange?: (t: T) => void;
}

export interface FilterControlProps<T> {
  readonly value?: T;
  readonly onChange?: (t: T) => void;
  readonly close: () => void;
}
