import { map, Observable, publishReplay, refCount } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Percent } from '../../../common/types';
import { settings, settings$ } from './settings';

export const slippage$: Observable<Percent> = settings$.pipe(
  map((settings) => settings.slippage),
  publishReplay(),
  refCount(),
);

export const useSlippage = (): Percent => {
  const [slippage] = useObservable(slippage$, [], settings.slippage);

  return slippage;
};
