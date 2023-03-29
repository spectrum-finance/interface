import { Currency } from '../../common/models/Currency';

export interface PlatformStats {
  readonly tvl: Currency;
  readonly volume: Currency;
}
