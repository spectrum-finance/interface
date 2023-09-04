import axios from 'axios';
import groupBy from 'lodash/groupBy';
import {
  first,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Address } from '../../../../common/models/Address';
import { Currency } from '../../../../common/models/Currency.ts';
import { Dictionary } from '../../../../common/utils/Dictionary';
import { getAddresses } from '../../../../gateway/api/addresses';
import { spfAsset } from '../../../ergo/api/networkAsset/networkAsset';

enum RewardSectionType {
  ISPO = 'SP0',
  LBSP = 'SP1',
  AIRDROP = 'SP2',
}

interface RawReword {
  readonly address: Address;
  readonly epoch: number;
  readonly reward: number;
  readonly rewardFor: RewardSectionType;
}

export type RewardSection = {
  readonly upcoming?: Currency;
  readonly collected?: Currency;
  readonly items: RawReword[];
};

export type RewardsData = {
  lbspRewards?: RewardSection;
  ispoRewards?: RewardSection;
  airdropRewards?: RewardSection;
  totalCollected: Currency;
};

const buildRewardsData = (rawRewards: RawReword[]): RewardsData => {
  const groupedRawRewards: Dictionary<RawReword[]> = groupBy<RawReword>(
    rawRewards,
    (rawReward) => rawReward.rewardFor,
  );

  return Object.entries(groupedRawRewards).reduce<RewardsData>(
    (rewardsData, [key, rawRewards]) => {
      const collectedSum = rawRewards.reduce<Currency>(
        (sum, rawReward) =>
          sum.plus(new Currency(rawReward.reward.toString(), spfAsset)),
        new Currency(0n, spfAsset),
      );

      if (key === RewardSectionType.ISPO) {
        return {
          ...rewardsData,
          ispoRewards: {
            items: rawRewards,
            upcoming: new Currency(0n, spfAsset),
            collected: collectedSum,
          },
          totalCollected: rewardsData.totalCollected.plus(collectedSum),
        };
      }
      if (key === RewardSectionType.LBSP) {
        return {
          ...rewardsData,
          lbspRewards: {
            items: rawRewards,
            upcoming: new Currency(0n, spfAsset),
            collected: collectedSum,
          },
          totalCollected: rewardsData.totalCollected.plus(collectedSum),
        };
      }
      if (key === RewardSectionType.AIRDROP) {
        return {
          ...rewardsData,
          airdropRewards: {
            items: rawRewards,
            upcoming: new Currency(0n, spfAsset),
            collected: collectedSum,
          },
          totalCollected: rewardsData.totalCollected.plus(collectedSum),
        };
      }

      return rewardsData;
    },
    { totalCollected: new Currency(0n, spfAsset) },
  );
};

export const rewards$ = getAddresses().pipe(
  switchMap((addresses) =>
    from(
      axios.post('https://rewards.spectrum.fi/v1/rewards/byAddress', addresses),
    ),
  ),
  map((res) => buildRewardsData(res.data)),
  publishReplay(1),
  refCount(),
);
