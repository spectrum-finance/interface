import {
  BehaviorSubject,
  filter,
  interval,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../applicationConfig';

export const initializeApp = (): void => appInitialized$.next(true);

const appInitialized$ = new BehaviorSubject(false);

export const appTick$ = appInitialized$.pipe(
  filter(Boolean),
  switchMap(() =>
    interval(applicationConfig.applicationTick).pipe(startWith(0)),
  ),
  publishReplay(1),
  refCount(),
);
