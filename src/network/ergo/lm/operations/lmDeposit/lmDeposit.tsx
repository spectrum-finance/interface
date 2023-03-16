import { Modal } from '@ergolabs/ui-kit';
import React, { ReactNode } from 'react';
import { first, Observable, Subject, switchMap, tap } from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import { TxId } from '../../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../../components/ConfirmationModal/ConfirmationModal';
import { settings$ } from '../../../settings/settings';
import { ErgoPayModal } from '../../../widgets/ErgoPayModal/ErgoPayModal';
import { LmDepositOpenWallet } from '../../../widgets/LmDepositOpenWallet/LmDepositOpenWallet';
import { ErgoFarm } from '../../models/ErgoFarm';
import { LmDepositModalContent } from './LmDepositModalContent/LmDepositModalContent';

const lmDepositWithErgopay = (
  farm: ErgoFarm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  Modal.open(({ close }) => (
    <ErgoPayModal
      openWalletContent={(onTxRegister) =>
        createFarmModal(
          <LmDepositOpenWallet onTxRegister={onTxRegister} farm={farm} />,
        )
      }
      onTxRegister={(txId) => {
        subject.next(txId);
        subject.complete();
      }}
      close={close}
    />
  ));
  return subject;
};

const lmDepositWithWallet = (
  farm: ErgoFarm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId> => {
  const subject = new Subject<TxId>();
  openConfirmationModal(
    (next) => {
      return createFarmModal(
        <LmDepositModalContent
          onClose={(request, { xAmount, yAmount }) =>
            next(
              request.pipe(
                tap((txId) => {
                  subject.next(txId);
                  subject.complete();
                }),
              ),
              { xAsset: xAmount, yAsset: yAmount },
            )
          }
          farm={farm}
        />,
      );
    },
    Operation.STAKE,
    {
      xAsset: new Currency(0n, farm.ammPool.x.asset),
      yAsset: new Currency(0n, farm.ammPool.y.asset),
    },
  );

  return subject.asObservable();
};

export const lmDeposit = (
  farm: ErgoFarm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId> => {
  return settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay
        ? lmDepositWithErgopay(farm, createFarmModal)
        : lmDepositWithWallet(farm, createFarmModal),
    ),
  );
};
