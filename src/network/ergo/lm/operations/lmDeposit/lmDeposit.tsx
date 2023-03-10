import React, { ReactNode } from 'react';
import { Observable, Subject, tap } from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import { TxId } from '../../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../../components/ConfirmationModal/ConfirmationModal';
import { ErgoFarm } from '../../models/ErgoFarm';
import { LmDepositModalContent } from './LmDepositModalContent/LmDepositModalContent';

export const lmDeposit = (
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
