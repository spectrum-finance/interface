import { RustModule } from '@ergolabs/ergo-sdk';
import { BehaviorSubject } from 'rxjs';

import { initializeSettings } from './settings/settings';

export const initialized$ = new BehaviorSubject(false);

export const initialize = (): void => {
  RustModule.load().then(() => {
    initializeSettings();
    initialized$.next(true);
  });
};
