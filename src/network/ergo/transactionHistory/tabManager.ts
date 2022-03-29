import { map, publishReplay, refCount } from 'rxjs';

import { localStorageManager } from '../../../common/utils/localStorageManager';
import { makeId } from '../../../common/utils/makeId';

const SYNC_PROCESS_TAB_KEYS = 'sync-process-tab-keys';

export const tabId: string = makeId(10);

export const getSyncProcessTabs = (): string[] =>
  localStorageManager.get<string[]>(SYNC_PROCESS_TAB_KEYS) || [];

export const syncProcessTabs$ = localStorageManager
  .getStream<string[]>(SYNC_PROCESS_TAB_KEYS, true)
  .pipe(
    map((tabs) => tabs || []),
    publishReplay(1),
    refCount(),
  );

export const addToTabQueue = (): void => {
  const syncTabs =
    localStorageManager.get<string[]>(SYNC_PROCESS_TAB_KEYS) || [];

  if (syncTabs.includes(tabId)) {
    return;
  }

  localStorageManager.set<string[]>(
    SYNC_PROCESS_TAB_KEYS,
    syncTabs.concat(tabId),
  );
};

export const removeFromTabQueue = (): void => {
  const syncTabs =
    localStorageManager.get<string[]>(SYNC_PROCESS_TAB_KEYS) || [];

  if (!syncTabs.includes(tabId)) {
    return;
  }

  localStorageManager.set<string[]>(
    SYNC_PROCESS_TAB_KEYS,
    syncTabs.filter((t) => t !== tabId),
  );
};

export const clearTabQueue = (): void => {
  localStorageManager.remove(SYNC_PROCESS_TAB_KEYS);
};

export const isPrimaryTab = (): boolean => getSyncProcessTabs()[0] === tabId;
