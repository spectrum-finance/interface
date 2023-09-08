import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import {
  AssetAmount,
  FullTxIn,
  InputSelector,
  Value,
} from '@spectrumlabs/cardano-dex-sdk';
import { NetworkParams } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { InputCollector } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/wallet/inputSelector';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
import {
  combineLatest,
  first,
  from,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
  zip,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { BaseCreatePoolConfirmationModal } from '../../../../components/BaseCreatePoolConfirmationModal/BaseCreatePoolConfirmationModal';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { CreatePoolFormModel } from '../../../../pages/CreatePool/CreatePoolFormModel';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { networkAsset } from '../networkAsset/networkAsset';
import { ammTxFeeMapping } from './common/ammTxFeeMapping';
import { submitTx } from './common/submitTxCandidate';
import { transactionBuilder$ } from './common/transactionBuilder';

interface CreatePoolTxCandidateConfig {
  readonly x: Currency;
  readonly y: Currency;
  readonly feePct: number;
  readonly settings: CardanoSettings;
  readonly networkParams: NetworkParams;
}

interface MintingMetadata {
  readonly policyId: string;
  readonly script: string;
}

const getTokenMetadata = (
  utxo: FullTxIn,
  name: string,
  qty: number,
): Observable<[AssetAmount, MintingMetadata]> => {
  const assetHex = RustModule.CardanoWasm.AssetName.new(
    new TextEncoder().encode(name),
  ).to_hex();

  return from(
    axios
      .post<MintingMetadata>(`https://meta.spectrum.fi/cardano/minting/data/`, {
        txRef: utxo.txOut.txHash,
        outId: utxo.txOut.index,
        tnName: assetHex,
        qty,
      })
      .then(
        (res) =>
          [
            new AssetAmount(
              { policyId: res.data.policyId, name, nameHex: assetHex },
              BigInt(qty),
            ),
            res.data,
          ] as [AssetAmount, MintingMetadata],
      ),
  );
};

const toCreatePoolTxCandidate = ({
  x,
  y,
  feePct,
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
      map((txBuilder) => ({
        inputSelector: txBuilder['poolTxBuilder']['inputSelector'],
        inputCollector: txBuilder['inputCollector'],
      })),
      switchMap(
        ({
          inputSelector,
          inputCollector,
        }: {
          inputSelector: InputSelector;
          inputCollector: InputCollector;
        }) =>
          inputCollector
            .getInputs()
            .then((inputs) => inputSelector.select(inputs, Value(1n))),
      ),
      switchMap((utxos: FullTxIn[] | Error) => {
        if (utxos instanceof Error) {
          return throwError(utxos);
        }
        const utxo = utxos[0];
        return combineLatest([
          getTokenMetadata(
            utxo,
            `${yAmount.asset.name}_${xAmount.asset.name}_NFT`,
            1,
          ),
          getTokenMetadata(
            utxo,
            `${yAmount.asset.name}_${xAmount.asset.name}_LQ`,
            0x7fffffffffffffff,
          ),
          of(utxo),
        ]);
      }),
      switchMap(
        ([nftData, lqData, utxo]: [
          [AssetAmount, MintingMetadata],
          [AssetAmount, MintingMetadata],
          FullTxIn,
        ]) =>
          transactionBuilder$.pipe(
            switchMap((transactionBuilder) =>
              transactionBuilder.poolCreation({
                x: new AssetAmount(x.asset.data, x.amount),
                y: new AssetAmount(y.asset.data, y.amount),
                nft: nftData[0],
                lq: lqData[0],
                feeNum: BigInt((1 - Number((feePct / 100).toFixed(3))) * 1000),
                mintingCreationTxHash: utxo.txOut.txHash,
                mintingCreationTxOutIdx: utxo.txOut.index,
                lqMintingScript: lqData[1].script,
                nftMintingScript: nftData[1].script,
                txFees: ammTxFeeMapping,
                changeAddress: settings.address!,
                pk: settings.ph!,
              }),
            ),
          ),
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
        feePct,
        networkParams,
        settings,
      }),
    ),
    switchMap((tx) => submitTx(tx)),
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
