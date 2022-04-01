import {
  fromEvent,
  mapTo,
  merge,
  publishReplay,
  refCount,
  startWith,
} from 'rxjs';

export const isOnline$ = merge(
  fromEvent(window, 'online').pipe(mapTo(true)),
  fromEvent(window, 'offline').pipe(mapTo(false)),
).pipe(startWith(window.navigator.onLine), publishReplay(1), refCount());
isOnline$.subscribe();
