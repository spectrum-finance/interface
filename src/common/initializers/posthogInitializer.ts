import posthog from 'posthog-js';
import { of } from 'rxjs';

import { isDevEnv, isProd } from '../../utils/envUtils';
import { Initializer } from './core';

export const posthogInitializer: Initializer = () => {
  if (isDevEnv) {
    posthog.init('phc_V5DtnvFCrvYCO1ejBwVbyFZdt5VG1NBd5uU3wzwaa0I', {
      api_host: 'https://posthog.spectrum.fi',
    });
  }
  return of(true);
};
