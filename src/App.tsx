import { ContextModalProvider } from '@ergolabs/ui-kit';
import React, { Suspense, useEffect } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { BrowserRouter } from 'react-router-dom';
import { BehaviorSubject, first, mapTo, Observable, tap, zip } from 'rxjs';

import { applicationConfig } from './applicationConfig';
import { ApplicationRoutes, routesConfig } from './ApplicationRoutes';
import { useObservable } from './common/hooks/useObservable';
import { analyticsInitializer } from './common/initializers/analyticsInitializer';
import { gaInitializer } from './common/initializers/gaInitializer';
import { networkDomInitializer } from './common/initializers/networkDomInitializer';
import { sentryInitializer } from './common/initializers/sentryInitializer';
import { startAppTicks } from './common/streams/appTick';
import { AppLoadingProvider, SettingsProvider } from './context';
import { LanguageProvider } from './i18n/i18n';

const Application = () => {
  return (
    <BrowserRouter>
      <AppLoadingProvider>
        <SettingsProvider>
          <GoogleReCaptchaProvider
            reCaptchaKey={applicationConfig.reCaptchaKey}
          >
            <LanguageProvider>
              <ContextModalProvider>
                <ApplicationRoutes />
              </ContextModalProvider>
            </LanguageProvider>
          </GoogleReCaptchaProvider>
        </SettingsProvider>
      </AppLoadingProvider>
    </BrowserRouter>
  );
};

const initializers: Observable<boolean>[] = [
  sentryInitializer(),
  analyticsInitializer(),
  networkDomInitializer(routesConfig),
  gaInitializer(),
];

const isAppInitialized$ = new BehaviorSubject(false);
const initializeApp = () => {
  zip(initializers)
    .pipe(
      mapTo(true),
      tap(() => startAppTicks()),
      first(),
    )
    .subscribe(isAppInitialized$);
};

export const ApplicationInitializer: React.FC = () => {
  const [isAppInitialized] = useObservable(isAppInitialized$, [], false);

  useEffect(() => initializeApp(), []);

  if (!isAppInitialized) {
    return null;
  }

  return (
    <Suspense fallback={''}>
      <Application />
    </Suspense>
  );
};
