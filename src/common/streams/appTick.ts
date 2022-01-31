import { interval, publishReplay, refCount, startWith } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';

export const appTick$ = interval(applicationConfig.applicationTick).pipe(
  startWith(0),
  publishReplay(1),
  refCount(),
);
