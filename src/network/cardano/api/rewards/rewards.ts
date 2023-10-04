import axios from 'axios';
import groupBy from 'lodash/groupBy';
import {
  catchError,
  filter,
  from,
  interval,
  map,
  mapTo,
  merge,
  Observable,
  of,
  publishReplay,
  refCount,
  startWith,
  Subject,
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
  PENDING = 'pending',
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

export interface RawRewardResponse {
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
  readonly totalPending: Currency;
  readonly rawRewards: RawReward[];
};

export const updateRewards$ = new Subject<undefined>();

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
      const pendingSum = rawRewards.reduce(
        (acc, item) =>
          item.rewardStatus === RewardStatus.PENDING
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
          totalPending: rewardsData.totalPending.plus(pendingSum),
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
          totalPending: rewardsData.totalPending.plus(pendingSum),
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
          totalPending: rewardsData.totalPending.plus(pendingSum),
        };
      }

      return rewardsData;
    },
    {
      totalClaimed: new Currency(0n, rewardAsset),
      totalAvailable: new Currency(0n, rewardAsset),
      totalPending: new Currency(0n, rewardAsset),
      rawRewards: response.rewards,
    },
  );
};

export const rewardsRequest = (
  addresses: string[],
): Observable<RewardsData | undefined> =>
  from(
    axios.post('https://rewards.spectrum.fi/v1/rewards/data', addresses),
  ).pipe(
    map((res) => res.data),
    catchError(() => of(undefined)),
    map((data) => (data ? buildRewardsData(data) : undefined)),
  );

export const rewards$ = getAddresses().pipe(
  filter((addresses) => !!addresses?.length),
  switchMap((addresses) =>
    merge(updateRewards$, interval(10_000)).pipe(
      startWith(0),
      mapTo(addresses as string[]),
    ),
  ),
  switchMap((addresses) => rewardsRequest(addresses)),
  publishReplay(1),
  refCount(),
);
