import React, { Suspense, useEffect } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import { useObservable } from './common/hooks/useObservable';
import { startAppTicks } from './common/streams/appTick';
import Layout from './components/common/Layout/Layout';
import { MobilePlug } from './components/MobilePlug/MobilePlug';
import { AppLoadingProvider, SettingsProvider } from './context';
import { ContextModalProvider } from './ergodex-cdk';
import {
  initializeNetwork,
  networksInitialized$,
} from './gateway/common/network';
import { LanguageProvider } from './i18n/i18n';
import { AddLiquidityOrCreatePool } from './pages/AddLiquidityOrCreatePool/AddLiquidityOrCreatePool';
import { Liquidity } from './pages/Pool/Liquidity';
import { LockLiquidity } from './pages/Pool/LockLiquidity/LockLiquidity';
import { RelockLiquidity } from './pages/Pool/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/Pool/RemoveLiquidity/RemoveLiquidity';
import { WithdrawalLiquidity } from './pages/Pool/WithdrawalLiquidity/WithdrawalLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { Swap } from './pages/Swap/Swap';
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
                <Layout>
                  <BrowserView>
                    <Routes>
                      <Route path="/" element={<Navigate to="/swap" />} />
                      <Route path="/swap" element={<Swap />} />
                      <Route path="/pool" element={<Liquidity />} />
                      <Route
                        path="/pool/add"
                        element={<AddLiquidityOrCreatePool />}
                      />
                      <Route
                        path="/pool/create"
                        element={<AddLiquidityOrCreatePool />}
                      />
                      <Route
                        path="/pool/:poolId/remove"
                        element={<RemoveLiquidity />}
                      />
                      <Route
                        path="/pool/:poolId/lock"
                        element={<LockLiquidity />}
                      />
                      <Route
                        path="/pool/:poolId/relock"
                        element={<RelockLiquidity />}
                      />
                      <Route
                        path="/pool/:poolId/withdrawal"
                        element={<WithdrawalLiquidity />}
                      />
                      <Route
                        path="/pool/:poolId/add"
                        element={<AddLiquidityOrCreatePool />}
                      />
                      <Route path="/pool/:poolId" element={<PoolOverview />} />
                      <Route path="*" element={<Navigate to="/swap" />} />
                    </Routes>
                  </BrowserView>
                  <MobileView>
                    <MobilePlug />
                  </MobileView>
                </Layout>
              </ContextModalProvider>
            </LanguageProvider>
          </GoogleReCaptchaProvider>
        </SettingsProvider>
      </AppLoadingProvider>
    </BrowserRouter>
  );
};

const initializers: Observable<true>[] = [
  networksInitialized$.pipe(filter(Boolean)),
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
  initializeNetwork();
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
