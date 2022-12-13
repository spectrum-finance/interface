import {
  LmPool as ErgoBaseLmPool,
  LmPoolConfig as ErgoBaseLmPoolConfig,
} from '@ergolabs/ergo-dex-sdk';
import { cache } from 'decorator-cache-getter';

import { FarmState } from '../../pages/Farm/types/FarmState';
import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export abstract class LmPool {
  abstract readonly pool: ErgoBaseLmPool;

  abstract get id(): string;

  abstract get lq(): Currency;

  abstract get reward(): Currency;

  abstract get vlq(): Currency;

  abstract get tt(): Currency;
  abstract get config(): ErgoBaseLmPoolConfig;
  abstract get epochAlloc(): bigint;
  abstract get ammPool(): AmmPool;

  abstract epochsLeft(currentHeight: number): number;

  abstract get yourStake(): [Currency, Currency];
  abstract get availableLqShares(): [Currency, Currency];

  abstract get balanceLq(): Currency;

  abstract get balanceVlq(): Currency;

  abstract get currentHeight(): number;

  abstract get programBudget(): string;

  abstract get fullEpochsRemain(): number;

  @cache
  get shares(): [Currency, Currency] {
    return this.ammPool.shares(this.lq);
  }

  @cache
  get currentStatus(): FarmState {
    if (this.currentHeight < this.config.programStart) {
      return FarmState.Scheduled;
    }

    if (
      this.currentHeight >
      this.config.programStart + this.config.epochLen * this.config.epochNum
    ) {
      return FarmState.Finished;
    }

    return FarmState.Live;
  }
}
