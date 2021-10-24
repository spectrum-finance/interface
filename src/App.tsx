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
import { useBodyClass } from './hooks/useBodyClass';
import { Swap } from './pages';

const NotFound = () => <Redirect to="/" />;

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
              <Layout>
                <Switch>
                  <Route path="/" exact component={Swap} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </WalletAddressesProvider>
          </SettingsProvider>
        </WalletContextProvider>
      </AppLoadingProvider>
    </Router>
  );
};
