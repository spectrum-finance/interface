import { interval, publishReplay, refCount, startWith } from 'rxjs';

export const pollingInterval = interval(60_000).pipe(
  startWith(0),
  publishReplay(1),
  refCount(),
);
