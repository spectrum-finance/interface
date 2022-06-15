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
                      <Route path="" element={<Navigate to="swap" />} />
                      <Route path="swap" element={<Swap />} />
                      <Route path="pool">
                        <Route path="" element={<Liquidity />} />
                        <Route
                          path="add"
                          element={<AddLiquidityOrCreatePool />}
                        />
                        <Route
                          path="create"
                          element={<AddLiquidityOrCreatePool />}
                        />
                        <Route
                          path=":poolId/remove"
                          element={<RemoveLiquidity />}
                        />
                        <Route
                          path=":poolId/lock"
                          element={<LockLiquidity />}
                        />
                        <Route
                          path=":poolId/relock"
                          element={<RelockLiquidity />}
                        />
                        <Route
                          path=":poolId/withdrawal"
                          element={<WithdrawalLiquidity />}
                        />
                        <Route
                          path=":poolId/add"
                          element={<AddLiquidityOrCreatePool />}
                        />
                        <Route path=":poolId" element={<PoolOverview />} />
                      </Route>
                      <Route path="*" element={<Navigate to="/" />} />
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
