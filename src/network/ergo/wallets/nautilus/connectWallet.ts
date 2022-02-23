import { catchError, from, Observable, of, throwError } from 'rxjs';

export const connectWallet = (): Observable<any> => {
  if (!ergoConnector?.nautilus) {
    return throwError(() => new Error('EXTENSION_NOT_FOUND'));
  }
  return from(ergoConnector.nautilus.connect({ createErgoObject: false })).pipe(
    catchError(() => of(false)),
  );
};
