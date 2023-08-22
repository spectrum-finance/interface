import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import {
  AssetAmount,
  FullTxIn,
  TxCandidate,
  Value,
} from '@spectrumlabs/cardano-dex-sdk';
import { DepositTxInfo } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/interpreters/ammTxBuilder/depositAmmTxBuilder';
import { NetworkParams } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
import {
  combineLatest,
  first,
  from,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
  throwError,
  zip,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { addErrorLog } from '../../../../common/services/ErrorLogs';
import { TxId } from '../../../../common/types';
import { AddLiquidityFormModel } from '../../../../components/AddLiquidityForm/AddLiquidityFormModel';
import { BaseCreatePoolConfirmationModal } from '../../../../components/BaseCreatePoolConfirmationModal/BaseCreatePoolConfirmationModal';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { CreatePoolFormModel } from '../../../../pages/CreatePool/CreatePoolFormModel';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { DepositConfirmationModal } from '../../widgets/DepositConfirmationModal/DepositConfirmationModal';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { networkAsset } from '../networkAsset/networkAsset';
import { ammTxFeeMapping } from './common/ammTxFeeMapping';
import { DefaultInputSelector } from './common/inputSelector';
import { minExecutorReward } from './common/minExecutorReward';
import { submitTx } from './common/submitTxCandidate';
import { transactionBuilder$ } from './common/transactionBuilder';

interface CreatePoolTxCandidateConfig {
  readonly x: Currency;
  readonly y: Currency;
  readonly settings: CardanoSettings;
  readonly networkParams: NetworkParams;
}

const toCreatePoolTxCandidate = ({
  x,
  y,
  settings,
}: CreatePoolTxCandidateConfig): Observable<Transaction> => {
  if (!settings.address || !settings.ph) {
    throw new Error('[createPool]: wallet address is not selected');
  }

  let xAmount: AssetAmount;
  let yAmount: AssetAmount;

  if (y.isAssetEquals(networkAsset)) {
    xAmount = new AssetAmount(y.asset.data, y.amount);
    yAmount = new AssetAmount(x.asset.data, x.amount);
  } else {
    xAmount = new AssetAmount(x.asset.data, x.amount);
    yAmount = new AssetAmount(y.asset.data, y.amount);
  }

  transactionBuilder$
    .pipe(
      map((txBuilder) => txBuilder['poolTxBuilder']['inputSelector']),
      switchMap((inputSelector: DefaultInputSelector) =>
        inputSelector.select(Value(1n)),
      ),
      switchMap(([utxo]: FullTxIn[]) =>
        combineLatest([
          from(
            axios.post(`https://meta.spectrum.fi/cardano/minting/data/`, {
              txRef: utxo.txOut.txHash,
              outId: utxo.txOut.index,
              tnName: RustModule.CardanoWasm.AssetName.new(
                new TextEncoder().encode(
                  `${yAmount.asset.name}_${xAmount.asset.name}_NFT`,
                ),
              ).to_hex(),
              qty: 1,
            }),
          ),
          from(
            axios.post(`https://meta.spectrum.fi/cardano/minting/data/`, {
              txRef: utxo.txOut.txHash,
              outId: utxo.txOut.index,
              tnName: RustModule.CardanoWasm.AssetName.new(
                new TextEncoder().encode(
                  `${yAmount.asset.name}_${xAmount.asset.name}_LQ`,
                ),
              ).to_hex(),
              qty: 0x7fffffffffffffff,
            }),
          ),
        ]),
      ),
    )
    .subscribe(console.log);

  return throwError(new Error());

  // return transactionBuilder$.pipe(
  //   switchMap((txBuilder) =>
  //     txBuilder.deposit({
  //       x: xAmount,
  //       y: yAmount,
  //       pool: pool.pool as any,
  //       slippage: settings.slippage,
  //       txFees: ammTxFeeMapping,
  //       minExecutorReward: minExecutorReward,
  //       changeAddress: settings.address!,
  //       pk: settings.ph!,
  //     }),
  //   ),
  //   map((data: [Transaction | null, TxCandidate, DepositTxInfo]) => data[0]!),
  //   first(),
  // );
};

export const walletCreatePool = (
  feePct: number,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  zip([cardanoNetworkParams$, settings$]).pipe(
    first(),
    switchMap(([networkParams, settings]) =>
      toCreatePoolTxCandidate({
        x,
        y,
        networkParams,
        settings,
      }),
    ),
    switchMap((tx) => submitTx(tx)),
    tap({ error: addErrorLog({ op: 'createPool' }) }),
  );

export const createPool = (
  data: Required<CreatePoolFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  openConfirmationModal(
    (next) => {
      return (
        <BaseCreatePoolConfirmationModal
          value={data}
          createPool={walletCreatePool}
          Info={() => <></>}
          onClose={(request) =>
            next(
              request.pipe(
                tap((txId) => {
                  subject.next(txId);
                  subject.complete();
                }),
              ),
            )
          }
        />
      );
    },
    Operation.ADD_LIQUIDITY,
    {
      xAsset: data.x!,
      yAsset: data.y!,
    },
  );

  return subject.asObservable();
};
