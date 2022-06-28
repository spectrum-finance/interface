import './assets/styles/styles.less';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import posthog from 'posthog-js';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApplicationInitializer } from './App';
import { reportWebVitals } from './reportWebVitals';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.REACT_APP_SENTRY_ENV_FLAG,
  tracesSampleRate: 1.0,
});

posthog.init('phc_xj7UhUKne1v6TTlMq4fXEVaVM5VnEzS6pkNnUMkibXH', {
  api_host: 'https://posthog.spectrum.fi',
  autocapture: true,
});

ReactDOM.render(
  <React.StrictMode>
    <ApplicationInitializer />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
