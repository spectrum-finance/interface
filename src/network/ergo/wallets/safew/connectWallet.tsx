import { Trans } from '@lingui/macro';
import React from 'react';
import { catchError, from, Observable, of, throwError } from 'rxjs';

export const connectWallet = (): Observable<any> => {
  if (!ergoConnector?.safew) {
    return throwError(() => new Error(`EXTENSION_NOT_FOUND`));
  }

  if (!ergoConnector.safew?.getContext) {
    return of(
      <>
        <Trans>
          Wallet API has changed. Be sure to update your wallet to continue
          using it
        </Trans>
      </>,
    );
  }
  return from(ergoConnector.safew.connect({ createErgoObject: false })).pipe(
    catchError(() => of(false)),
  );
};
