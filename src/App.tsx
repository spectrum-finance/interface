import { ContextModalProvider } from '@ergolabs/ui-kit';
import { Suspense, useEffect } from 'react';
import * as React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { BrowserRouter } from 'react-router-dom';
import { BehaviorSubject, first, mapTo, Observable, tap, zip } from 'rxjs';

import { applicationConfig } from './applicationConfig';
import { ApplicationRoutes, routesConfig } from './ApplicationRoutes';
import { useObservable } from './common/hooks/useObservable';
import { networkDomInitializer } from './common/initializers/networkDomInitializer';
/* import { sentryInitializer } from './common/initializers/sentryInitializer'; */
import { SelectDefaultNetwork } from './common/services/NetworkDomManager/SelectDefaultNetwork/SelectDefaultNetwork';
import { startAppTicks } from './common/streams/appTick';
import { Glow } from './components/common/Layout/Glow/Glow';
import { ErrorEventProvider } from './components/ErrorBoundary/ErrorEventProvider';
import { AppLoadingProvider, useApplicationSettings } from './context';
import { useBodyClass } from './hooks/useBodyClass';
import { useMetaThemeColor } from './hooks/useMetaThemeColor';
import { LanguageProvider } from './i18n/i18n';
import { isDarkOsTheme } from './utils/osTheme';

const Application = () => {
  return (
    <AppLoadingProvider>
      <GoogleReCaptchaProvider reCaptchaKey={applicationConfig.reCaptchaKey}>
        <ContextModalProvider>
          <ApplicationRoutes />
        </ContextModalProvider>
      </GoogleReCaptchaProvider>
    </AppLoadingProvider>
  );
};

const initializers: Observable<boolean>[] = [
  // sentryInitializer(),
  // analyticsInitializer(),
  networkDomInitializer(routesConfig),
  // gaInitializer(),
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
  const [{ theme }] = useApplicationSettings();
  const [isAppInitialized] = useObservable(isAppInitialized$, [], false);

  useBodyClass([theme]);
  useMetaThemeColor(
    {
      dark: '#1D1D1D',
      light: `#F0F2F5`,
      hosky: '#1D1D1D',
      snek: '#1D1D1D',
      'snek-dark': '#1D1D1D',
      get system() {
        return isDarkOsTheme() ? this.dark : this.light;
      },
    },
    theme,
  );
  useEffect(() => initializeApp(), []);

  return (
    <Suspense fallback={''}>
      <ErrorEventProvider>
        <BrowserRouter>
          <LanguageProvider>
            <Glow />
            <SelectDefaultNetwork>
              {isAppInitialized && <Application />}
            </SelectDefaultNetwork>
          </LanguageProvider>
        </BrowserRouter>
      </ErrorEventProvider>
    </Suspense>
  );
};
