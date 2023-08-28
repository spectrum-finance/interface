import { Currency } from '../../../../../common/models/Currency.ts';

export type Reward = {
  upcoming?: Currency;
  collected?: Currency;
};

export type RewardsData = {
  lbspRewards?: Reward;
  ispoRewards?: Reward;
  airdropRewards?: Reward;
  totalCollected?: Currency;
};
