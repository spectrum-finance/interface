import axios from 'axios';
import groupBy from 'lodash/groupBy';
import {
  filter,
  from,
  interval,
  map,
  mapTo,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { Address } from '../../../../common/models/Address';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency.ts';
import { Dictionary } from '../../../../common/utils/Dictionary';
import { getAddresses } from '../../../../gateway/api/addresses';

export enum RewardSectionType {
  ISPO = 'SP0',
  LBSP = 'SP1',
  AIRDROP = 'airdrop',
}

export enum RewardStatus {
  AVAILABLE = 'available',
  RECEIVED = 'received',
}

export const rewardAsset: AssetInfo = {
  name: 'Spf',
  ticker: 'SPF',
  icon: `${applicationConfig.networksSettings.ergo.metadataUrl}/9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d.svg`,
  id: '09f2d4e4a5c3662f4c1e6a7d9600e9605279dbdcedb22d4507cb6e75535046',
  decimals: 6,
  data: {
    policyId: '09f2d4e4a5c3662f4c1e6a7d9600e9605279dbdcedb22d4507cb6e75',
    name: 'SPF',
    nameHex: '43535046',
  },
};

export interface RawReward {
  readonly address: Address;
  readonly epoch: number;
  readonly reward: number;
  readonly rewardFor: RewardSectionType;
  readonly rewardStatus: RewardStatus;
}

interface RawRewardResponse {
  readonly rewards: RawReward[];
  readonly upcoming: { sp0?: number; sp1?: number };
}

export type RewardSection = {
  readonly upcoming?: Currency;
  readonly claimed: Currency;
  readonly available: Currency;
  readonly items: RawReward[];
};

export type RewardsData = {
  readonly lbspRewards?: RewardSection;
  readonly ispoRewards?: RewardSection;
  readonly airdropRewards?: RewardSection;
  readonly totalAvailable: Currency;
  readonly totalClaimed: Currency;
  readonly rawRewards: RawReward[];
};

const buildRewardsData = (response: RawRewardResponse): RewardsData => {
  const groupedRawRewards: Dictionary<RawReward[]> = groupBy<RawReward>(
    response.rewards,
    (rawReward) => rawReward.rewardFor,
  );

  return Object.entries(groupedRawRewards).reduce<RewardsData>(
    (rewardsData, [key, rawRewards]) => {
      const claimedSum = rawRewards.reduce(
        (acc, item) =>
          item.rewardStatus === RewardStatus.RECEIVED
            ? acc.plus(new Currency(item.reward.toString(), rewardAsset))
            : acc,
        new Currency(0n, rewardAsset),
      );
      const availableSum = rawRewards.reduce(
        (acc, item) =>
          item.rewardStatus === RewardStatus.AVAILABLE
            ? acc.plus(new Currency(item.reward.toString(), rewardAsset))
            : acc,
        new Currency(0n, rewardAsset),
      );

      if (key === RewardSectionType.ISPO) {
        return {
          ...rewardsData,
          ispoRewards: {
            items: rawRewards,
            upcoming: new Currency(
              response.upcoming.sp0?.toString() || 0n,
              rewardAsset,
            ),
            claimed: claimedSum,
            available: availableSum,
          },
          totalAvailable: rewardsData.totalAvailable.plus(availableSum),
          totalClaimed: rewardsData.totalClaimed.plus(claimedSum),
        };
      }
      if (key === RewardSectionType.LBSP) {
        return {
          ...rewardsData,
          lbspRewards: {
            items: rawRewards,
            upcoming: new Currency(
              response.upcoming.sp1?.toString() || 0n,
              rewardAsset,
            ),
            claimed: claimedSum,
            available: availableSum,
          },
          totalAvailable: rewardsData.totalAvailable.plus(availableSum),
          totalClaimed: rewardsData.totalClaimed.plus(claimedSum),
        };
      }
      if (key === RewardSectionType.AIRDROP) {
        return {
          ...rewardsData,
          airdropRewards: {
            items: rawRewards,
            claimed: claimedSum,
            available: availableSum,
          },
          totalAvailable: rewardsData.totalAvailable.plus(availableSum),
          totalClaimed: rewardsData.totalClaimed.plus(claimedSum),
        };
      }

      return rewardsData;
    },
    {
      totalClaimed: new Currency(0n, rewardAsset),
      totalAvailable: new Currency(0n, rewardAsset),
      rawRewards: response.rewards,
    },
  );
};

export const rewards$ = getAddresses().pipe(
  filter((addresses) => !!addresses?.length),
  switchMap((addresses) =>
    interval(60_000).pipe(startWith(0), mapTo(addresses)),
  ),
  switchMap((addresses) =>
    from(axios.post('https://rewards.spectrum.fi/v1/rewards/data', addresses)),
  ),
  map((res) => buildRewardsData(res.data)),
  publishReplay(1),
  refCount(),
);
