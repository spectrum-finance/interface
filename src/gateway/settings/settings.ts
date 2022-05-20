import { first, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { BaseNetworkSettings } from '../../network/common/NetworkSettings';
import { initialNetwork, selectedNetwork$ } from '../common/network';

export const settings$: Observable<BaseNetworkSettings> = selectedNetwork$.pipe(
  switchMap((n) => n.settings$),
  publishReplay(),
  refCount(),
);

export const setSettings = (settings: BaseNetworkSettings): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.setSettings(settings));
};

export const useSettings = (): BaseNetworkSettings => {
  const [settings] = useObservable(settings$, [], initialNetwork.settings);

  return settings;
};
