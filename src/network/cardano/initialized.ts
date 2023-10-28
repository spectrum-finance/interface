import { RustModule } from '@teddyswap/cardano-dex-sdk/build/main/utils/rustLoader';
import { BehaviorSubject } from 'rxjs';

import { initializeSettings } from './settings/settings';
import { initializeDAppBridge } from './utils/initializeDAppBridge';

export const initialized$ = new BehaviorSubject(false);

export const initialize = (): void => {
  Promise.all([initializeDAppBridge(), RustModule.load()]).then(() => {
    initializeSettings();
    initialized$.next(true);
  });
};
