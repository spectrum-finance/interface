import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { RawStakeWithRedeemerKey } from '../api/stakes/stakes';
import { ErgoFarm } from './ErgoFarm';

export class Stake {
  get ammPool(): AmmPool {
    return this.lmPool.ammPool;
  }

  get lq(): Currency {
    return new Currency(this.rawStake.lockedLq.amount, this.lmPool.assets.lq);
  }

  get shares(): [Currency, Currency] {
    return this.ammPool.shares(this.lq);
  }

  get x(): Currency {
    return this.shares[0];
  }

  get y(): Currency {
    return this.shares[1];
  }

  constructor(
    public readonly rawStake: RawStakeWithRedeemerKey,
    public readonly lmPool: ErgoFarm,
  ) {}
}
