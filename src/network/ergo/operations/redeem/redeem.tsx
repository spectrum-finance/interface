import { Modal } from '@ergolabs/ui-kit';
import { first, Observable, Subject, switchMap, tap } from 'rxjs';

import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { RemoveLiquidityFormModel } from '../../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { settings$ } from '../../settings/settings';
import { ErgoPayModal } from '../../widgets/ErgoPayModal/ErgoPayModal';
import { RedeemConfirmationModal } from '../../widgets/RedeemConfirmationModal/RedeemConfirmationModal';
import { RedeemOpenWallet } from '../../widgets/RedeemOpenWallet/RedeemOpenWallet';

const redeemWithErgopay = (
  pool: ErgoAmmPool,
  data: Required<RemoveLiquidityFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  Modal.open(({ close }) => (
    <ErgoPayModal
      openWalletContent={(onTxRegister) => (
        <RedeemOpenWallet
          pool={pool}
          value={data}
          onTxRegister={onTxRegister}
        />
      )}
      onTxRegister={(txId) => {
        subject.next(txId);
        subject.complete();
      }}
      close={close}
    />
  ));
  return subject;
};

const redeemWithWallet = (
  pool: ErgoAmmPool,
  data: Required<RemoveLiquidityFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  openConfirmationModal(
    (next) => {
      return (
        <RedeemConfirmationModal
          pool={pool}
          value={data}
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
    Operation.REMOVE_LIQUIDITY,
    {
      xAsset: data.xAmount,
      yAsset: data.yAmount,
    },
  );

  return subject.asObservable();
};

export const redeem = (
  pool: ErgoAmmPool,
  data: Required<RemoveLiquidityFormModel>,
): Observable<TxId> =>
  settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay
        ? redeemWithErgopay(pool, data)
        : redeemWithWallet(pool, data),
    ),
  );
