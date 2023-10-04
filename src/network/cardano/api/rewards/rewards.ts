import { HexString } from '@spectrumlabs/cardano-dex-sdk';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
import groupBy from 'lodash/groupBy';
import last from 'lodash/last';
import {
  catchError,
  combineLatest,
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
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency.ts';
import { Address } from '../../../../common/types';
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

const ADDRESSES_IN_REQUEST_LIMIT = 400;

const requestRewards = (
  addresses: string[],
): Observable<RawRewardResponse | undefined> =>
  from(
    axios.post('https://rewards.spectrum.fi/v1/rewards/data', addresses),
  ).pipe(
    map((res) => res.data),
    catchError(() => of(undefined)),
  );

export const combineRequests = (
  allAddresses: string[],
): Observable<RewardsData | undefined> => {
  const addressesBatch: string[][] = [[]];

  for (const address of allAddresses) {
    const lastItem = last(addressesBatch);
    if (!lastItem) {
      break;
    }
    if (lastItem.length >= ADDRESSES_IN_REQUEST_LIMIT) {
      addressesBatch.push([address]);
    } else {
      lastItem.push(address);
    }
  }

  const getStakeKeyHash = (address: string): HexString | undefined =>
    RustModule.CardanoWasm.BaseAddress.from_address(
      RustModule.CardanoWasm.Address.from_bech32(address),
    )
      ?.stake_cred()
      .to_keyhash()
      ?.to_hex();

  return combineLatest(addressesBatch.map(requestRewards)).pipe(
    map(
      (responses: (RawRewardResponse | undefined)[]) =>
        responses.filter(Boolean) as RawRewardResponse[],
    ),
    map((responses: RawRewardResponse[]) => {
      if (!responses.length) {
        return undefined;
      }
      return responses.reduce<RawRewardResponse>(
        (acc, item) => {
          const filteredItems = item.rewards.filter((rewardItem) => {
            const stakeKeyHash = getStakeKeyHash(rewardItem.address);

            if (
              rewardItem.rewardFor !== RewardSectionType.AIRDROP ||
              !stakeKeyHash
            ) {
              return true;
            }
            return acc.rewards.every(
              (accItem) =>
                getStakeKeyHash(accItem.address) !== stakeKeyHash ||
                accItem.epoch !== rewardItem.epoch,
            );
          });
          return {
            rewards: acc.rewards.concat(filteredItems),
            upcoming: {
              sp0: item.upcoming.sp0
                ? (acc.upcoming.sp0 || 0) + item.upcoming.sp0
                : acc.upcoming.sp0,
              sp1: item.upcoming.sp1
                ? (acc.upcoming.sp1 || 0) + item.upcoming.sp1
                : acc.upcoming.sp1,
            },
          };
        },
        { rewards: [], upcoming: { sp0: 0, sp1: 0 } },
      );
    }),
    map((data) => (data ? buildRewardsData(data) : undefined)),
  );
};

export const rewards$ = getAddresses().pipe(
  filter((addresses) => !!addresses?.length),
  switchMap((addresses) =>
    merge(updateRewards$, interval(10_000)).pipe(
      startWith(0),
      mapTo(addresses),
    ),
  ),
  switchMap((addresses) => combineRequests(addresses as string[])),
  publishReplay(1),
  refCount(),
);
