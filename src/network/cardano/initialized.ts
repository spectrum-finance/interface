import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { BehaviorSubject } from 'rxjs';

import { openCardanoFaucetNotification } from '../../services/notifications/СardanoFaucet/СardanoFaucet';
import { initializeSettings } from './settings/settings';

export const initialized$ = new BehaviorSubject(false);

export const initialize = (): void => {
  RustModule.load().then(() => {
    initializeSettings();
    openCardanoFaucetNotification();
    initialized$.next(true);
  });
};
