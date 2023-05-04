import { RustModule } from '@ergolabs/ergo-sdk';
import { BehaviorSubject } from 'rxjs';

import {
  ergoPayAnalytics$,
  initializeErgoPayAnalytics,
} from './analytics/ergopay';
import { initializeSettings } from './settings/settings';

export const initialized$ = new BehaviorSubject(false);

export const initialize = (): void => {
  RustModule.load().then(() => {
    initializeSettings();
    initializeErgoPayAnalytics();
    initialized$.next(true);
  });
};
