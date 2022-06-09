export interface Filter<T> {
  readonly name: string;
  readonly value?: T;
  readonly onChange?: (t: T) => void;
}
