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

export const startAppTicks = (): void => appTicksStarted$.next(true);

const appTicksStarted$ = new BehaviorSubject(false);

export const appTick$ = appTicksStarted$.pipe(
  filter(Boolean),
  switchMap(() =>
    interval(applicationConfig.applicationTick).pipe(startWith(0)),
  ),
  publishReplay(1),
  refCount(),
);
