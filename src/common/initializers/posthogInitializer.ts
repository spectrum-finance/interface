import posthog from 'posthog-js';
import { of } from 'rxjs';

import { Initializer } from './core';

export const posthogInitializer: Initializer = () => {
  posthog.init('phc_xj7UhUKne1v6TTlMq4fXEVaVM5VnEzS6pkNnUMkibXH', {
    api_host: 'https://posthog.spectrum.fi',
    autocapture: true,
  });

  return of(true);
};
