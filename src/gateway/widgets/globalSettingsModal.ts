import { map, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const globalSettingsModal$ = selectedNetwork$.pipe(
  map((n) => n.GlobalSettingsModal),
  publishReplay(),
  refCount(),
);
