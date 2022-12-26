import * as amplitude from '@amplitude/analytics-browser';
import Cookies from 'js-cookie';
import { DateTime } from 'luxon';
import posthog from 'posthog-js';
import { first, map, of, zip } from 'rxjs';

import { version } from '../../../package.json';
import { applicationConfig } from '../../applicationConfig';
import { applicationSettings$, Settings } from '../../context';
import { selectedNetwork$ } from '../../gateway/common/network';
import { Network } from '../../network/common/Network';
import { panalytics } from '../analytics';
import { Initializer } from './core';

const mapToFirstLaunchData = ([selectedNetwork, applicationSettings]: [
  Network<any, any>,
  Settings,
]) => ({
  active_network: selectedNetwork.name,
  active_locale: applicationSettings.lang,
  active_theme: applicationSettings.theme,
  cohort_date: DateTime.now().toFormat('yyyymmdd'),
  cohort_day: DateTime.now().ordinal,
  cohort_month: DateTime.now().month,
  cohort_year: DateTime.now().year,
  cohort_version: version,
});

const mapToSessionStartData = ([selectedNetwork, applicationSettings]: [
  Network<any, any>,
  Settings,
]) => ({
  active_network: selectedNetwork.name,
  active_locale: applicationSettings.lang,
  active_theme: applicationSettings.theme,
});

const POSTHOG_API = 'https://anph.spectrum.fi';

const ANALYTICS_SYSTEMS_INITIALIZED = 'analytic-systems-initialized';

let ANALYTICS_SYSTEMS_QUANTITY = 0;

export const panalyticsInitializer: Initializer = () => {
  let systemsInitializedCount = 0;

  const sendInitialEvent = () => {
    if (Cookies.get(ANALYTICS_SYSTEMS_INITIALIZED)) {
      zip([selectedNetwork$, applicationSettings$])
        .pipe(first(), map(mapToSessionStartData))
        .subscribe((launchData) => {
          panalytics.sessionStart(launchData);
        });
    } else {
      Cookies.set(ANALYTICS_SYSTEMS_INITIALIZED, 'true', {
        domain: applicationConfig.cookieDomain,
      });

      zip([selectedNetwork$, applicationSettings$])
        .pipe(first(), map(mapToFirstLaunchData))
        .subscribe((launchData) => {
          panalytics.firstLaunch(launchData);
        });
    }
  };

  if (
    process.env.REACT_APP_POSTHOG_API_KEY &&
    process.env.NODE_ENV === 'production'
  ) {
    ANALYTICS_SYSTEMS_QUANTITY += 1;
    posthog.init(process.env.REACT_APP_POSTHOG_API_KEY, {
      api_host: POSTHOG_API,
      autocapture: false,
      loaded: () => {
        systemsInitializedCount += 1;

        if (systemsInitializedCount === ANALYTICS_SYSTEMS_QUANTITY) {
          sendInitialEvent();
        }
      },
    });
  }

  if (
    process.env.REACT_APP_AMPLITUDE_API_KEY &&
    process.env.NODE_ENV === 'production'
  ) {
    ANALYTICS_SYSTEMS_QUANTITY += 1;
    amplitude
      .init(process.env.REACT_APP_AMPLITUDE_API_KEY, undefined, {})
      .promise.then(() => {
        systemsInitializedCount += 1;

        if (systemsInitializedCount === ANALYTICS_SYSTEMS_QUANTITY) {
          sendInitialEvent();
        }
      });
  }
  return of(true);
};
