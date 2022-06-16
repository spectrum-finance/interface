import React, { Suspense, useEffect } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { BrowserRouter } from 'react-router-dom';
import {
  BehaviorSubject,
  filter,
  first,
  mapTo,
  Observable,
  tap,
  zip,
} from 'rxjs';

import { applicationConfig } from './applicationConfig';
import { ApplicationRoutes, routesConfig } from './ApplicationRoutes';
import { useObservable } from './common/hooks/useObservable';
import { NetworkDomManager } from './common/services/NetworkDomManager';
import { startAppTicks } from './common/streams/appTick';
import Layout from './components/common/Layout/Layout';
import { MobilePlug } from './components/MobilePlug/MobilePlug';
import { AppLoadingProvider, SettingsProvider } from './context';
import { ContextModalProvider } from './ergodex-cdk';
import { LanguageProvider } from './i18n/i18n';
import { openCookiePolicy } from './services/notifications/CookiePolicy/CookiePolicy';

const Application = () => {
  useEffect(() => {
    openCookiePolicy();
  }, []);

  return (
    <BrowserRouter>
      <AppLoadingProvider>
        <SettingsProvider>
          <GoogleReCaptchaProvider
            reCaptchaKey={applicationConfig.reCaptchaKey}
          >
            <LanguageProvider>
              <ContextModalProvider>
                <BrowserView>
                  <ApplicationRoutes />
                </BrowserView>
                <MobileView>
                  <Layout>
                    <MobilePlug />
                  </Layout>
                </MobileView>
              </ContextModalProvider>
            </LanguageProvider>
          </GoogleReCaptchaProvider>
        </SettingsProvider>
      </AppLoadingProvider>
    </BrowserRouter>
  );
};

const initializers: Observable<true>[] = [
  NetworkDomManager.initialized$.pipe(filter(Boolean)),
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
  NetworkDomManager.init(routesConfig);
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
