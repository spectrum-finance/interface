import { RustModule } from '@ergolabs/ergo-sdk';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import Layout from './components/common/Layout/Layout';
import {
  AppLoadingProvider,
  SettingsProvider,
  // useAppLoadingState,
  WalletAddressesProvider,
  WalletContextProvider,
} from './context';
import { useTheme } from './context/Theme';
import { globalHistory } from './createBrowserHistory';
import { ContextModalProvider } from './ergodex-cdk';
import { useBodyClass } from './hooks/useBodyClass';
import { Swap } from './pages';
import { Pool } from './pages/Pool/Pool';

const NotFound = () => <Redirect to="/swap" />;

export const App: React.FC = () => {
  const theme = useTheme();
  useBodyClass(theme);

  const [isRustModuleLoaded, setIsRustModuleLoaded] = useState(false);

  useEffect(() => {
    RustModule.load().then(() => setIsRustModuleLoaded(true));
  }, []);

  if (!isRustModuleLoaded) {
    return null;
  }

  return (
    <Router history={globalHistory}>
      <AppLoadingProvider>
        <WalletContextProvider>
          <SettingsProvider>
            <WalletAddressesProvider>
              <ContextModalProvider>
                <Layout>
                  <Switch>
                    <Route path="/" exact>
                      <Redirect to="/swap" />
                    </Route>
                    <Route path="/swap" exact component={Swap} />
                    <Route path="/pool" exact component={Pool} />
                    <Route component={NotFound} />
                  </Switch>
                </Layout>
              </ContextModalProvider>
            </WalletAddressesProvider>
          </SettingsProvider>
        </WalletContextProvider>
      </AppLoadingProvider>
    </Router>
  );
};
