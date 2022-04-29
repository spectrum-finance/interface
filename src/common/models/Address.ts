import { Currency } from './Currency';

export interface Address {
  readonly addr: string;
  readonly networkAssetBalance: Currency;
}
