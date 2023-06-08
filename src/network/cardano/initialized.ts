import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { BehaviorSubject } from 'rxjs';

import { initializeSettings } from './settings/settings';
import {
  CardanoNetworkData,
  setCardanoNetworkData,
} from './utils/cardanoNetworkData';

export const initialized$ = new BehaviorSubject(false);

export const initialize = (data: CardanoNetworkData) => (): void => {
  RustModule.load().then(() => {
    setCardanoNetworkData(data);
    initializeSettings();
    initialized$.next(true);
  });
};
