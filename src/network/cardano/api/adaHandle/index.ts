import { combineLatest, map, Observable } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable.ts';
import {
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
);

export const hasAdaHandle$: Observable<boolean> = adaHandleBalance$.pipe(
  map((arr) => arr.length > 0),
);

export const hasActiveAdaHandleOnBalance$: Observable<boolean> = combineLatest([
  adaHandleBalance$,
  settings$,
]).pipe(
  map(([arr, { activeAdaHandle }]) => {
    return arr.some(
      (adaHandle) => activeAdaHandle && adaHandle.id === activeAdaHandle.id,
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
  activeHandle: AdaHandle | undefined,
  setActiveHandle: (activeHandle?: AdaHandle) => void,
] => {
  const settings = useSettings();
  const activeAdaHandle = settings.activeAdaHandle;
  const patchActiveHande = (active?: AdaHandle) => {
    patchSettings({ activeAdaHandle: active });
  };

  return [activeAdaHandle, patchActiveHande];
};
