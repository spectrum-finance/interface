import { filter, first } from 'rxjs';

import { networksInitialized$ } from '../../gateway/common/network.ts';
import { ergoNetwork } from '../../network/ergo/ergo.ts';
import { Initializer } from './core';

export const networkDomInitializer: Initializer = () => {
  ergoNetwork.initialize();
  return networksInitialized$.pipe(filter(Boolean), first());
};
