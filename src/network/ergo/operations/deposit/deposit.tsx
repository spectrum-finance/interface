import { Modal } from '@ergolabs/ui-kit';
import React from 'react';
import { first, Observable, Subject, switchMap, tap } from 'rxjs';

import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { AddLiquidityFormModel } from '../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { settings$ } from '../../settings/settings';
import { DepositConfirmationModal } from '../../widgets/DepositConfirmationModal/DepositConfirmationModal';
import { DepositOpenWallet } from '../../widgets/DepositOpenWallet/DepositOpenWallet';
import { ErgoPayModal } from '../../widgets/ErgoPayModal/ErgoPayModal';

const depositWithWallet = (
  data: Required<AddLiquidityFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  openConfirmationModal(
    (next) => {
      return (
        <DepositConfirmationModal
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
    Operation.ADD_LIQUIDITY,
    {
      xAsset: data.x!,
      yAsset: data.y!,
    },
  );

  return subject.asObservable();
};

const depositWithErgopay = (
  data: Required<AddLiquidityFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  Modal.open(({ close }) => (
    <ErgoPayModal
      openWalletContent={(onTxRegister) => (
        <DepositOpenWallet value={data} onTxRegister={onTxRegister} />
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

export const deposit = (
  data: Required<AddLiquidityFormModel>,
): Observable<TxId> => {
  return settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay ? depositWithErgopay(data) : depositWithWallet(data),
    ),
  );
};
