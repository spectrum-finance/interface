import { Subject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/types';
import { HexString } from '@ergolabs/ergo-sdk';

interface AssetInfoItem<T> {
  readonly value: T;
}

export interface AssetInfo {
  readonly subject: Subject;
  readonly policy: HexString;
  readonly url: AssetInfoItem<string>;
  readonly name: AssetInfoItem<string>;
  readonly ticker: AssetInfoItem<string>;
  readonly logo: AssetInfoItem<string>;
  readonly description: AssetInfoItem<string>;
  readonly decimals: AssetInfoItem<number>;
}
