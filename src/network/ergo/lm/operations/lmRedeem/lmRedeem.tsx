import React, { ReactNode } from 'react';
import { Observable, Subject, tap } from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import { TxId } from '../../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../../components/ConfirmationModal/ConfirmationModal';
import { ErgoFarm } from '../../models/ErgoFarm';
import { LmRedeemModalContent } from './LmRedeemModalContent/LmRedeemModalContent';

export const lmRedeem = (
  farm: ErgoFarm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId[]> => {
  const subject = new Subject<TxId[]>();
  openConfirmationModal(
    (next) => {
      return createFarmModal(
        <LmRedeemModalContent
          onClose={(request) =>
            next(
              request.pipe(
                tap((txIds) => {
                  subject.next(txIds);
                  subject.complete();
                }),
              ),
            )
          }
          farm={farm}
        />,
      );
    },
    Operation.SWAP,
    {
      xAsset: new Currency(0n, farm.ammPool.x.asset),
      yAsset: new Currency(0n, farm.ammPool.y.asset),
    },
  );

  return subject.asObservable();
};
