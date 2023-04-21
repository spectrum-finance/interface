import { AppName, initAnalytics } from '@spectrumlabs/analytics';
import { of } from 'rxjs';

import { version } from '../../../package.json';
import { isProductionEnv } from '../utils/env';
import { Initializer } from './core';

const ANALYTICS_DUMMY_KEY = '00000000000000000000000000000000';
const ANALYTICS_PROXY_URL = process.env.REACT_APP_AMPLITUDE_PROXY_URL;

export const analyticsInitializer: Initializer = () => {
  initAnalytics(ANALYTICS_DUMMY_KEY, AppName.WEB_APP, {
    proxyUrl: ANALYTICS_PROXY_URL,
    defaultEventName: 'Page Viewed',
    commitHash: COMMIT_HASH,
    version: version,
    isProdEnv: isProductionEnv(),
    isDebug: true,
  });

  return of(true);
};
