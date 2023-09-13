import { Observable, Subject, tap } from 'rxjs';

import { TxId } from '../../../../common/types';
import { BaseCreatePoolConfirmationModal } from '../../../../components/BaseCreatePoolConfirmationModal/BaseCreatePoolConfirmationModal';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { CreatePoolFormModel } from '../../../../pages/CreatePool/CreatePoolFormModel';
import { CreatePoolConfirmationInfo } from '../../widgets/CreatePoolConfirmationInfo/CreatePoolConfirmationInfo';
import { walletCreatePool } from './walletCreatePool';

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
      xAsset: data.x,
      yAsset: data.y,
    },
  );

  return subject;
};
