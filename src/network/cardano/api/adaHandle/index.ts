import { combineLatest, map, Observable, publishReplay, refCount } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable.ts';
import {
  CardanoSettings,
  patchSettings,
  settings$,
  useSettings,
} from '../../settings/settings.ts';
import { assetBalance$ } from '../balance/assetBalance.ts';

export type AdaHandle = { id: string; name?: string };

const ADA_HANDLE_POLICY_ID =
  'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

const adaHandleBalance$: Observable<AdaHandle[]> = assetBalance$.pipe(
  map((balance) => {
    return balance
      .values()
      .filter(({ asset, amount }) => {
        return asset.id.includes(ADA_HANDLE_POLICY_ID) && amount === 1n;
      })
      .map((c) => ({
        id: c.asset.id,
        name: c.asset.name,
      }));
  }),
  publishReplay(1),
  refCount(),
);

export const hasAdaHandle$: Observable<boolean> = adaHandleBalance$.pipe(
  map((arr) => arr.length > 0),
);

export const hasActiveAdaHandleOnBalance$: Observable<boolean> = combineLatest([
  adaHandleBalance$,
  settings$,
]).pipe(
  map(([arr, { activeAdaHandles }]: [AdaHandle[], CardanoSettings]) => {
    return !!arr.some((adaHandle) =>
      activeAdaHandles?.some((ah) => ah.id === adaHandle.id),
    );
  }),
);

export const useAdaHandleBalance = (): [AdaHandle[], boolean, Error] =>
  useObservable(adaHandleBalance$, [], []);

export const useHasAdaHandle = (): [boolean, boolean, Error] =>
  useObservable(hasAdaHandle$, [], false);

export const useHasActiveAdaHandleOnBalance = (): [boolean, boolean, Error] =>
  useObservable(hasActiveAdaHandleOnBalance$, [], false);

export const useAdaHandle = (): [
  AdaHandle | undefined,
  (activeHandle?: AdaHandle) => void,
] => {
  const { activeAdaHandles } = useSettings();
  const [adaHandleBalance] = useAdaHandleBalance();
  const currentActiveAdaHandle: AdaHandle | undefined = activeAdaHandles?.find(
    (ah) => adaHandleBalance.some((ahb) => ahb.id === ah.id),
  );

  const setActiveHandle = (newActiveHandle?: AdaHandle) => {
    if (newActiveHandle && currentActiveAdaHandle) {
      patchSettings({
        activeAdaHandles: activeAdaHandles?.map((item) =>
          item.id === currentActiveAdaHandle.id ? newActiveHandle : item,
        ),
      });
    } else if (newActiveHandle) {
      patchSettings({
        activeAdaHandles: (activeAdaHandles || []).concat(newActiveHandle),
      });
    } else if (!newActiveHandle && currentActiveAdaHandle) {
      patchSettings({
        activeAdaHandles: (activeAdaHandles || []).filter(
          (item) => item.id !== currentActiveAdaHandle.id,
        ),
      });
    }
  };

  return [currentActiveAdaHandle, setActiveHandle];
};
