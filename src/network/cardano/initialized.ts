import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { BehaviorSubject } from 'rxjs';

import { initializeSettings } from './settings/settings';

export const initialized$ = new BehaviorSubject(false);

export const initialize = (): void => {
  RustModule.load().then(() => {
    initializeSettings();
    initialized$.next(true);
  });
};
