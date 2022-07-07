import { map, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const refundConfirmationInfo$ = selectedNetwork$.pipe(
  map((n) => n.RefundConfirmationInfo),
  publishReplay(),
  refCount(),
);
