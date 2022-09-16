import { map, Observable, publishReplay, refCount } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Percent } from '../../../common/types';
import { getSettings, settings$ } from './settings';

export const nitro$: Observable<Percent> = settings$.pipe(
  map((settings) => settings.nitro),
  publishReplay(),
  refCount(),
);

export const useNitro = (): Percent => {
  const [nitro] = useObservable(nitro$, [], getSettings().nitro);

  return nitro;
};
