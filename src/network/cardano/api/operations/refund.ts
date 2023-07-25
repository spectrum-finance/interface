import {
  mkTxAsm,
  mkTxMath,
  RefundTxBuilder,
  ScriptCredsV1,
} from '@spectrumlabs/cardano-dex-sdk';
import {
  OpInRefsMainnetV1,
  OrderAddrsV1Mainnet,
} from '@spectrumlabs/cardano-dex-sdk/build/main/amm/scripts';
import { NetworkParams } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { CardanoWasm } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  combineLatest,
  first,
  map,
  Observable,
  publishReplay,
  refCount,
  Subject,
  switchMap,
  tap,
  zip,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { addErrorLog } from '../../../../common/services/ErrorLogs';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation as ModalOperation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { settings$ } from '../../settings/settings';
import {
  cardanoNetwork,
  cardanoNetworkParams$,
} from '../common/cardanoNetwork';
import { cardanoWasm$ } from '../common/cardanoWasm';
import {
  DefaultCollateralSelector,
  DefaultInputSelector,
} from './common/inputSelector';
import { submitTx } from './common/submitTxCandidate';

export const refundBuilder$ = combineLatest([
  cardanoWasm$,
  cardanoNetworkParams$,
]).pipe(
  map(([cardanoWasm, cardanoNetworkParams]: [CardanoWasm, NetworkParams]) => {
    const txMath = mkTxMath(cardanoNetworkParams.pparams, cardanoWasm);
    const inputSelector = new DefaultInputSelector();
    const collateralSelector = new DefaultCollateralSelector();
    const txAsm = mkTxAsm(cardanoNetworkParams, cardanoWasm);

    return new RefundTxBuilder(
      {
        swap: {
          address: OrderAddrsV1Mainnet.ammSwap,
          script: ScriptCredsV1.ammSwap,
          opInRef: OpInRefsMainnetV1.ammSwap,
        },
        deposit: {
          address: OrderAddrsV1Mainnet.ammDeposit,
          script: ScriptCredsV1.ammDeposit,
          opInRef: OpInRefsMainnetV1.ammDeposit,
        },
        redeem: {
          address: OrderAddrsV1Mainnet.ammRedeem,
          script: ScriptCredsV1.ammRedeem,
          opInRef: OpInRefsMainnetV1.ammRedeem,
        },
        defaultCollateralAmount: 5000000n,
      },
      inputSelector,
      collateralSelector,
      cardanoWasm,
      txMath,
      txAsm,
      cardanoNetworkParams.pparams,
      cardanoNetwork,
    );
  }),
  publishReplay(1),
  refCount(),
);

const walletRefund = (txId: TxId): Observable<TxId> =>
  zip([settings$]).pipe(
    first(),
    switchMap(([settings]) =>
      refundBuilder$.pipe(
        switchMap((refundBuilder) =>
          refundBuilder.refund({
            txId,
            recipientAddress: settings.address!,
          }),
        ),
      ),
    ),
    map((data) => data[1]),
    map((tx) => {
      if (!tx) {
        throw new Error('');
      }
      return tx;
    }),
    switchMap((tx) => submitTx(tx, true)),
    tap({ error: addErrorLog({ txId, op: 'refund' }) }),
  );

export const refund = (
  txId: TxId,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> => {
  const subject = new Subject<TxId>();
  openConfirmationModal(
    walletRefund(txId).pipe(
      tap((txId) => {
        subject.next(txId);
        subject.complete();
      }),
    ),
    ModalOperation.REFUND,
    {
      xAsset: xAmount,
      yAsset: yAmount,
    },
  );

  return subject.asObservable();
};
