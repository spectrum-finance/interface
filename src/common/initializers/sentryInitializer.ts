import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { of } from 'rxjs';

import { Initializer } from './core';

export const sentryInitializer: Initializer = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    environment: process.env.REACT_APP_SENTRY_ENV_FLAG,
    tracesSampleRate: 1.0,
  });

  return of(true);
};
