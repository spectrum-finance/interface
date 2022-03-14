import React from 'react';
import { catchError, from, Observable, of, throwError } from 'rxjs';

export const connectWallet = (): Observable<any> => {
  if (!ergoConnector?.nautilus) {
    return throwError(() => new Error('EXTENSION_NOT_FOUND'));
  }

  if (!ergoConnector.nautilus?.getContext) {
    return of(
      <>
        Wallet API has changed. Be sure to update your wallet to continue using
        it
      </>,
    );
  }
  return from(ergoConnector.nautilus.connect({ createErgoObject: false })).pipe(
    catchError(() => of(false)),
  );
};
