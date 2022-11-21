import {
  LmPool as ErgoBaseLmPool,
  LmPoolConfig as ErgoBaseLmPoolConfig,
} from '@ergolabs/ergo-dex-sdk';

import { Currency } from './Currency';

export abstract class LmPool {
  abstract readonly pool: ErgoBaseLmPool;

  abstract get id(): string;

  abstract get lq(): Currency;

  abstract get vlq(): Currency;

  abstract get tt(): Currency;
  abstract get config(): ErgoBaseLmPoolConfig;
  abstract get epochAlloc(): bigint;

  abstract epochsLeft(currentHeight: number): number;
}
