import {
  interval,
  publishReplay,
  refCount,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

const stopPolling$ = new Subject<void>();

export const pollingInterval$ = interval(60_000).pipe(
  startWith(0),
  takeUntil(stopPolling$),
  publishReplay(1),
  refCount(),
);

export const stopPolling = (): void => {
  stopPolling$.next();
};
