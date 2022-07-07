import posthog from 'posthog-js';
import { of } from 'rxjs';

import { isDevEnv, isProd } from '../../utils/envUtils';
import { Initializer } from './core';

export const posthogInitializer: Initializer = () => {
  if (isDevEnv) {
    posthog.init('phc_W0I06T1ivqb8JfKzDJco6wkJDYuO71p71KjcNkkOelb', {
      api_host: 'https://posthog.spectrum.fi',
    });
  }
  return of(true);
};
