import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { calculateTotalFee } from '../../../common/utils/calculateTotalFee';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { maxExecutionFee$, minExecutionFee$ } from './executionFee';
import { minerFee$ } from './minerFee';

export const minTotalFee$ = combineLatest([minerFee$, minExecutionFee$]).pipe(
  map(([minerFee, minExecutionFee]) =>
    calculateTotalFee([minerFee, minExecutionFee], networkAsset),
  ),
  publishReplay(1),
  refCount(),
);

export const maxTotalFee$ = combineLatest([minerFee$, maxExecutionFee$]).pipe(
  map(([minerFee, maxExecutionFee]) =>
    calculateTotalFee([minerFee, maxExecutionFee], networkAsset),
  ),
  publishReplay(1),
  refCount(),
);
