import { CANCEL_REQUEST } from '@ergolabs/ui-kit/dist/components/Modal/presets/Request';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Event } from '@sentry/types/dist/event';
import { of } from 'rxjs';

import { setErrorEvent } from '../../components/ErrorBoundary/ErrorEventProvider';
import { Initializer } from './core';

export const sentryInitializer: Initializer = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    environment: import.meta.env.VITE_SENTRY_ENV_FLAG,
    beforeSend: (event: Event) => {
      if (event.message === CANCEL_REQUEST) {
        return null;
      }
      setErrorEvent({
        id: event.event_id,
        message: event.message,
        timestamp: event.timestamp,
      });
      return event;
    },
    tracesSampleRate: 1.0,
  });

  return of(true);
};
