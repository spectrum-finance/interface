import './i18n';

import { RustModule } from '@ergolabs/ergo-sdk';
import React, { Suspense, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { TABLET_BRAKE_POINT } from './common/constants/screen';
import Layout from './components/common/Layout/Layout';
import { MobilePlug } from './components/MobilePlug/MobilePlug';
import {
  AppLoadingProvider,
  SettingsProvider,
  WalletAddressesProvider,
  WalletContextProvider,
} from './context';
import { globalHistory } from './createBrowserHistory';
import { ContextModalProvider } from './ergodex-cdk';
import { useWindowSize } from './hooks/useWindowSize';
import { AddLiquidity } from './pages/Pool/AddLiquidity/AddLiquidity';
import { LockLiquidity } from './pages/Pool/LockLiquidity/LockLiquidity';
import { Pool } from './pages/Pool/Pool';
import { RelockLiquidity } from './pages/Pool/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/Pool/RemoveLiquidity/RemoveLiquidity';
import { WithdrawalLiquidity } from './pages/Pool/WithdrawalLiquidity/WithdrawalLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { Swap } from './pages/Swap/Swap';

const NotFound = () => <Redirect to="/swap" />;

const Application = withTranslation()(() => {
  const [windowWidth] = useWindowSize();

  return (
    <Router history={globalHistory}>
      <AppLoadingProvider>
        <WalletContextProvider>
          <SettingsProvider>
            <WalletAddressesProvider>
              <ContextModalProvider>
                <Layout>
                  {windowWidth > TABLET_BRAKE_POINT ? (
                    <Switch>
                      <Route path="/" exact>
                        <Redirect to="/swap" />
                      </Route>
                      <Route path="/swap" exact component={Swap} />
                      <Route path="/pool" exact component={Pool} />
                      <Route path="/pool/add" exact component={AddLiquidity} />
                      <Route
                        path="/pool/:poolId/remove"
                        exact
                        component={RemoveLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/lock"
                        exact
                        component={LockLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/relock"
                        exact
                        component={RelockLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/withdrawal"
                        exact
                        component={WithdrawalLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/add"
                        exact
                        component={AddLiquidity}
                      />
                      <Route
                        path="/pool/:poolId"
                        exact
                        component={PoolOverview}
                      />
                      <Route component={NotFound} />
                    </Switch>
                  ) : (
                    <MobilePlug />
                  )}
                </Layout>
              </ContextModalProvider>
            </WalletAddressesProvider>
          </SettingsProvider>
        </WalletContextProvider>
      </AppLoadingProvider>
    </Router>
  );
});

export const ApplicationInitializer: React.FC = () => {
  const [isRustModuleLoaded, setIsRustModuleLoaded] = useState(false);

  useEffect(() => {
    RustModule.load().then(() => setIsRustModuleLoaded(true));
  }, []);

  if (!isRustModuleLoaded) {
    return null;
  }

  return (
    <Suspense fallback={''}>
      <Application />
    </Suspense>
  );
};
