import { Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { PlatformStats } from '../../network/common/PlatformStats';
import { selectedNetwork$ } from '../common/network';

export const platformStats$: Observable<PlatformStats> = selectedNetwork$.pipe(
  switchMap((n) => n.platformStats$),
  publishReplay(1),
  refCount(),
);
