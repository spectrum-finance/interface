import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { AssetAmount, mkTxAsm, mkTxMath } from '@spectrumlabs/cardano-dex-sdk';
import { AdaEntry } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetEntry';
import { NetworkParams } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { encodeHex } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/hex';
import {
  CardanoWasm,
  RustModule,
} from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
import groupBy from 'lodash/groupBy';
import last from 'lodash/last';
import { DateTime } from 'luxon';
import {
  catchError,
  combineLatest,
  filter,
  first,
  from,
  interval,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { captureOperationError } from '../../../../common/services/ErrorLogs';
import { TxId } from '../../../../common/types';
import { localStorageManager } from '../../../../common/utils/localStorageManager';
import { getAddresses } from '../../../../gateway/api/addresses';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { cardanoWasm$ } from '../common/cardanoWasm';
import { networkAsset } from '../networkAsset/networkAsset';
import { ammTxFeeMapping } from '../operations/common/ammTxFeeMapping';
import {
  DefaultInputCollector,
  DefaultInputSelector,
} from '../operations/common/inputSelector';
import { submitTx } from '../operations/common/submitTxCandidate';
import {
  ADDRESSES_IN_REQUEST_LIMIT,
  combineRequests,
  RawReward,
  rewardAsset,
  RewardsData,
  RewardStatus,
  updateRewards$,
} from './rewards';
import { ClaimNotAvailableError } from './utils';

interface ClaimTxResponse {
  readonly transaction: Transaction | null;
  readonly requiredAda: Currency;
  readonly addresses: string[];
  readonly error: Error | string | null;
}

export const buildClaimTx = (
  rewardsData: RewardsData,
): Observable<ClaimTxResponse> => {
  const groupedByAddress = groupBy(
    rewardsData.rawRewards.filter(
      (item) => item.rewardStatus === RewardStatus.AVAILABLE,
    ),
    (rawReward) => rawReward.address,
  );
  const outputsData: { address: string; spf: Currency }[] = Object.entries(
    groupedByAddress,
  ).map(([key, rewards]: [string, RawReward[]]) =>
    rewards.reduce(
      (acc, item) => ({
        ...acc,
        spf: acc.spf.plus(new Currency(item.reward.toString(), rewardAsset)),
      }),
      { address: key, spf: new Currency(0n, rewardAsset) },
    ),
  );

  return combineLatest([cardanoWasm$, cardanoNetworkParams$, settings$]).pipe(
    switchMap(
      ([cardanoWasm, cardanoNetworkParams, settings]: [
        CardanoWasm,
        NetworkParams,
        CardanoSettings,
      ]) => {
        const txMath = mkTxMath(cardanoNetworkParams.pparams, cardanoWasm);
        const txAsm = mkTxAsm(cardanoNetworkParams, cardanoWasm);
        const inputSelector = new DefaultInputSelector();
        const inputCollector = new DefaultInputCollector();

        const minAdaRequiredForClaiming =
          outputsData
            .map((item) =>
              txMath.minAdaRequiredforOutput({
                addr: item.address,
                value: [
                  new AssetAmount(item.spf.asset.data, item.spf.amount).toEntry,
                ],
                data: undefined,
              }),
            )
            .reduce((acc, item) => acc + item, 0n) +
          ammTxFeeMapping.swapOrder * BigInt(outputsData.length + 1);

        const datumList = RustModule.CardanoWasm.PlutusList.new();

        outputsData.forEach((item) => {
          const itemList = RustModule.CardanoWasm.PlutusList.new();
          const address = RustModule.CardanoWasm.Address.from_bech32(
            item.address,
          );
          const baseAddress =
            RustModule.CardanoWasm.BaseAddress.from_address(address);
          const pc = baseAddress?.payment_cred()?.to_keyhash();
          const sc = baseAddress?.stake_cred()?.to_keyhash();

          if (pc) {
            itemList.add(
              RustModule.CardanoWasm.PlutusData.new_bytes(pc.to_bytes()),
            );
          }
          if (sc) {
            itemList.add(
              RustModule.CardanoWasm.PlutusData.new_bytes(sc.to_bytes()),
            );
          }

          datumList.add(RustModule.CardanoWasm.PlutusData.new_list(itemList));
        });

        const wrapList = RustModule.CardanoWasm.PlutusList.new();
        wrapList.add(RustModule.CardanoWasm.PlutusData.new_list(datumList));
        const datum = RustModule.CardanoWasm.PlutusData.new_constr_plutus_data(
          RustModule.CardanoWasm.ConstrPlutusData.new(
            RustModule.CardanoWasm.BigNum.zero(),
            wrapList,
          ),
        );

        return from(inputCollector.getInputs()).pipe(
          map((inputs) => {
            const selectedInputs = inputSelector.select(inputs, [
              AdaEntry(minAdaRequiredForClaiming),
            ]);

            if (selectedInputs instanceof Error) {
              throw selectedInputs;
            }
            return txAsm.finalize({
              inputs: selectedInputs,
              outputs: [
                {
                  value: [AdaEntry(minAdaRequiredForClaiming)],
                  data: encodeHex(datum.to_bytes()),
                  addr: 'addr1vx3vcluw7qtulynhzsy4prfdmnjth8w52ejg2qeclsz7argu26gcf',
                },
              ],
              changeAddr: settings.address!,
            });
          }),
          map((transaction) => ({
            transaction,
            error: null,
            addresses: outputsData.map((item) => item.address),
            requiredAda: new Currency(minAdaRequiredForClaiming, networkAsset),
          })),
          catchError((error) =>
            of({
              transaction: null,
              error,
              addresses: outputsData.map((item) => item.address),
              requiredAda: new Currency(
                minAdaRequiredForClaiming,
                networkAsset,
              ),
            }),
          ),
          first(),
        );
      },
    ),
  );
};

export const claimRewards = (rewardsData: RewardsData): Observable<TxId> => {
  return getAddresses().pipe(
    filter((addresses) => !!addresses?.length),
    first(),
    switchMap((addresses) =>
      combineLatest([
        combineRequests(addresses as string[]),
        rewardsRequestStatusRequest(addresses as string[]),
      ]),
    ),
    switchMap(([rewards, status]: [RewardsData | undefined, boolean]) => {
      if (
        status ||
        !rewards ||
        rewards?.totalPending.isPositive() ||
        !rewards?.totalAvailable.isPositive()
      ) {
        throw new ClaimNotAvailableError('claim not available');
      }

      return buildClaimTx(rewardsData).pipe(
        switchMap(({ transaction, error }) => {
          if (transaction) {
            return submitTx(transaction);
          }
          throw error;
        }),
        tap({
          error: (error) => captureOperationError(error, 'cardano', 'claim'),
        }),
        tap(() =>
          localStorageManager.set(
            CLAIM_IN_MEMPOOL_KEY,
            DateTime.now().toMillis(),
          ),
        ),
        first(),
      );
    }),
  );
};

const CLAIM_IN_MEMPOOL_KEY = 'CLAIM_IN_MEMPOOL';

export enum ClaimRewardsStatus {
  LOADING,
  IN_MEMPOOL,
  PAYMENT_HANDLING,
  AVAILABLE,
}

const rewardsRequestStatusRequest = (
  allAddresses: string[],
): Observable<boolean> => {
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

  return combineLatest(
    addressesBatch.map((addresses) =>
      from(
        axios.post(
          'https://rewards.spectrum.fi/v1/rewards/payment/request/status',
          addresses,
        ),
      ).pipe(map((res) => res.data)),
    ),
  ).pipe(
    map((responses) => {
      return responses.some(Boolean);
    }),
  );
};

const isPaymentHandling$ = interval(5_000).pipe(
  startWith(0),
  switchMap(() => getAddresses()),
  switchMap((addresses) =>
    addresses ? rewardsRequestStatusRequest(addresses) : of(false),
  ),
  tap((isPaymentHandling) => {
    if (isPaymentHandling && localStorageManager.get(CLAIM_IN_MEMPOOL_KEY)) {
      updateRewards$.next(undefined);
      localStorageManager.remove(CLAIM_IN_MEMPOOL_KEY);
    }
  }),
  publishReplay(1),
  refCount(),
);

const isClaimInMempool$ = localStorageManager
  .getStream<number | undefined | null>(CLAIM_IN_MEMPOOL_KEY)
  .pipe(publishReplay(1), refCount());

export const rewardsPaymentRequestStatus$: Observable<ClaimRewardsStatus> =
  combineLatest([isPaymentHandling$, isClaimInMempool$]).pipe(
    map(
      ([isPaymentHandling, isClaimInMempool]: [
        boolean,
        number | undefined | null,
      ]) => {
        if (isClaimInMempool) {
          return ClaimRewardsStatus.IN_MEMPOOL;
        }
        if (isPaymentHandling) {
          return ClaimRewardsStatus.PAYMENT_HANDLING;
        }
        return ClaimRewardsStatus.AVAILABLE;
      },
    ),
    startWith(ClaimRewardsStatus.LOADING),
    publishReplay(1),
    refCount(),
  );

interval(5_000)
  .pipe(startWith(0))
  .subscribe(() => {
    const claimRegisterTs = localStorageManager.get<number | undefined | null>(
      CLAIM_IN_MEMPOOL_KEY,
    );

    if (!claimRegisterTs) {
      return;
    }
    if (DateTime.now().toMillis() - claimRegisterTs > 5 * 60_000) {
      localStorageManager.remove(CLAIM_IN_MEMPOOL_KEY);
      updateRewards$.next(undefined);
    }
  });
