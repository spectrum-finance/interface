export interface AssetInfo<T = any> {
  readonly id: string;
  readonly name?: string;
  readonly ticker?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly decimals?: number;
  readonly data?: T;
}
