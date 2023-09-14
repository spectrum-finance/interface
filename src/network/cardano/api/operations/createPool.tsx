import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { FormGroup } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import {
  AssetAmount,
  FullTxIn,
  InputSelector,
  PoolCreationTxInfo,
  TxCandidate,
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

import { Balance } from '../../../../common/models/Balance';
import { Currency } from '../../../../common/models/Currency';
import { Ratio } from '../../../../common/models/Ratio';
import { captureOperationError } from '../../../../common/services/ErrorLogs';
import { TxId } from '../../../../common/types';
import { BaseCreatePoolConfirmationModal } from '../../../../components/BaseCreatePoolConfirmationModal/BaseCreatePoolConfirmationModal';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { normalizeAmountWithFee } from '../../../../pages/AddLiquidityOrCreatePool/common/utils';
import { CreatePoolFormModel } from '../../../../pages/CreatePool/CreatePoolFormModel';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { CreatePoolConfirmationInfo } from '../../widgets/CreatePoolConfirmationInfo/CreatePoolConfirmationInfo';
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
  qty: string,
): Observable<[AssetAmount, MintingMetadata]> => {
  const asset = RustModule.CardanoWasm.AssetName.new(
    new TextEncoder().encode(name),
  );

  return from(
    axios
      .post<{ result: 'Ok' | 'Failed' }>(
        `https://meta.spectrum.fi/cardano/minting/data/`,
        {
          txRef: utxo.txOut.txHash,
          outId: utxo.txOut.index,
          tnName: JSON.parse(asset.to_json()),
          qty,
        },
      )
      .then((res) => {
        if (res.data.result === 'Ok') {
          return axios.post<MintingMetadata>(
            'https://meta.spectrum.fi/cardano/minting/data/finalize/',
            {
              txRef: utxo.txOut.txHash,
              outId: utxo.txOut.index,
              tnName: JSON.parse(asset.to_json()),
              qty,
            },
          );
        } else {
          throw new Error('not ok');
        }
      })
      .then(
        (res) =>
          [
            new AssetAmount(
              { policyId: res.data.policyId, name, nameHex: asset.to_hex() },
              BigInt(qty),
            ),
            res.data,
          ] as [AssetAmount, MintingMetadata],
      ),
  );
};

export const toCreatePoolTxCandidate = ({
  x,
  y,
  feePct,
  settings,
}: CreatePoolTxCandidateConfig): Observable<
  [Transaction | null, TxCandidate, PoolCreationTxInfo, Error | null]
> => {
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

  return transactionBuilder$.pipe(
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
          `${yAmount.asset.name}_${xAmount.asset.name || 'ADA'}_NFT`,
          '1',
        ),
        getTokenMetadata(
          utxo,
          `${yAmount.asset.name}_${xAmount.asset.name || 'ADA'}_LQ`,
          '9223372036854775807',
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
              collateralAmount: 5000000n,
              pk: settings.ph!,
            }),
          ),
        ),
    ),
    first(),
  );
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
    switchMap((data) => submitTx(data[0]!)),
    tap({
      error: (error) => captureOperationError(error, 'cardano', 'createPool'),
    }),
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
          Info={CreatePoolConfirmationInfo}
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

const MIN_CREATE_POOL_LIQUIDITY = new Currency('500', networkAsset);

export const useCreatePoolValidators =
  (): OperationValidator<CreatePoolFormModel>[] => {
    const minLiquidityValidator: OperationValidator<CreatePoolFormModel> = (
      form,
    ) => {
      const validationCaption = t`Min liquidity for creation is ${MIN_CREATE_POOL_LIQUIDITY.mult(
        2,
      ).toString()} ADA`;

      if (form.value.x?.isAssetEquals(networkAsset)) {
        return form.value.x?.gte(MIN_CREATE_POOL_LIQUIDITY)
          ? undefined
          : validationCaption;
      }
      if (form.value.y?.isAssetEquals(networkAsset)) {
        return form.value.y?.gte(MIN_CREATE_POOL_LIQUIDITY)
          ? undefined
          : validationCaption;
      }
      return true;
    };

    const insufficientAssetForFeeValidator: OperationValidator<CreatePoolFormModel> =
      (form) => {
        const { x, y, fee } = form.value;

        if (!x || !y || !fee) {
          return undefined;
        }

        const newX = x?.isAssetEquals(networkAsset) ? x : y;
        const newY = x?.isAssetEquals(networkAsset) ? y : x;

        return zip([cardanoNetworkParams$, settings$]).pipe(
          first(),
          switchMap(([networkParams, settings]) =>
            toCreatePoolTxCandidate({
              x: newX,
              y: newY,
              feePct: fee,
              networkParams,
              settings,
            }),
          ),
          map((data) => {
            return data[0]
              ? undefined
              : t`Insufficient ${networkAsset.ticker} balance for fees`;
          }),
        );
      };

    return [minLiquidityValidator, insufficientAssetForFeeValidator];
  };

export const useHandleCreatePoolMaxButtonClick = () => {
  return (
    pct: number,
    form: FormGroup<CreatePoolFormModel>,
    balance: Balance,
  ) => {
    const { xAsset, yAsset, initialPrice } = form.value;
    const totalFees = new Currency(0n, networkAsset);

    if (!xAsset || !yAsset || !initialPrice) {
      return;
    }

    let newXAmount = normalizeAmountWithFee(
      balance.get(xAsset).percent(pct),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );
    let ratio: Ratio =
      initialPrice.quoteAsset.id === newXAmount?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();
    let newYAmount = normalizeAmountWithFee(
      ratio.toBaseCurrency(newXAmount),
      balance.get(yAsset),
      networkAsset,
      totalFees,
    );

    if (
      newXAmount.isPositive() &&
      newYAmount.isPositive() &&
      newYAmount.lte(balance.get(yAsset))
    ) {
      form.patchValue(
        {
          x: newXAmount,
          y: newYAmount,
        },
        { emitEvent: 'silent' },
      );
      return;
    }

    newYAmount = normalizeAmountWithFee(
      balance.get(yAsset).percent(pct),
      balance.get(yAsset),
      networkAsset,
      totalFees,
    );
    ratio =
      initialPrice.quoteAsset.id === newYAmount?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();
    newXAmount = normalizeAmountWithFee(
      ratio.toBaseCurrency(newYAmount),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );

    if (
      newYAmount.isPositive() &&
      newXAmount.isPositive() &&
      newXAmount.lte(balance.get(xAsset))
    ) {
      form.patchValue(
        {
          x: newXAmount,
          y: newYAmount,
        },
        { emitEvent: 'silent' },
      );
      return;
    }

    if (balance.get(xAsset).isPositive()) {
      ratio =
        initialPrice.quoteAsset.id === xAsset.id
          ? initialPrice
          : initialPrice.invertRatio();

      form.patchValue(
        {
          x: balance.get(xAsset).percent(pct),
          y: ratio.toBaseCurrency(balance.get(xAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
      return;
    } else {
      ratio =
        initialPrice.quoteAsset.id === yAsset.id
          ? initialPrice
          : initialPrice.invertRatio();

      form.patchValue(
        {
          y: balance.get(yAsset).percent(pct),
          x: ratio.toBaseCurrency(balance.get(yAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
    }
  };
};
