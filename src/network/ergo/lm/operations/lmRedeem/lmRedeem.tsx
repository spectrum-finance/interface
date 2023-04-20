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
import { LmRedeemOpenWallet } from '../../../widgets/LmRedeemOpenWallet/LmRedeemOpenWallet';
import { ErgoFarm } from '../../models/ErgoFarm';
import { LmRedeemModalContent } from './LmRedeemModalContent/LmRedeemModalContent';

export const lmRedeemWithWallet = (
  farm: ErgoFarm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId> => {
  const subject = new Subject<TxId>();
  openConfirmationModal(
    (next) => {
      return createFarmModal(
        <LmRedeemModalContent
          onClose={(request, stake) =>
            next(
              request.pipe(
                tap((txId) => {
                  subject.next(txId);
                  subject.complete();
                }),
              ),
              { xAsset: stake.x, yAsset: stake.y },
            )
          }
          farm={farm}
        />,
      );
    },
    Operation.UNSTAKE,
    {
      xAsset: new Currency(0n, farm.ammPool.x.asset),
      yAsset: new Currency(0n, farm.ammPool.y.asset),
    },
  );

  return subject.asObservable();
};

const lmRedeemWithErgopay = (
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
          <LmRedeemOpenWallet onTxRegister={onTxRegister} farm={farm} />,
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

export const lmRedeem = (
  farm: ErgoFarm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId> =>
  settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay
        ? lmRedeemWithErgopay(farm, createFarmModal)
        : lmRedeemWithWallet(farm, createFarmModal),
    ),
  );
