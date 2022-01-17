import { of } from 'rxjs';

import { Balance } from '../../../common/models/Balance';

export const balance$ = of(new Balance([]));
