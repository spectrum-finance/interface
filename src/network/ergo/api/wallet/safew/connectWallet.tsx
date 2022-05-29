import { catchError, from, Observable, of, throwError } from 'rxjs';

export const connectWallet = (): Observable<any> => {
  // Wait 0.2s to be sure the ergoConnector is loaded in the page
  // With mv3, there is no guarantee for it to be loaded before the page
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > 200) {
      break;
    }
  }

  if (!ergoConnector?.safew) {
    return throwError(() => new Error('EXTENSION_NOT_FOUND'));
  }

  return from(ergoConnector.safew.connect({ createErgoObject: false })).pipe(
    catchError(() => of(false)),
  );
};
