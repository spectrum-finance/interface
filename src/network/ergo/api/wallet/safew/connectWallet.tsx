import {
  catchError,
  from,
  Observable,
  of,
  switchMap,
  throwError,
  timer,
} from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';

export const connectWallet = (): Observable<any> => {
  return timer(applicationConfig.connectWalletDelayMs).pipe(
    switchMap(() => {
      if (!ergoConnector?.safew) {
        return throwError(() => new Error('EXTENSION_NOT_FOUND'));
      }

      return from(
        ergoConnector.safew.connect({ createErgoObject: false }),
      ).pipe(catchError(() => of(false)));
    }),
  );
};
