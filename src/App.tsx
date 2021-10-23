import { RustModule } from '@ergolabs/ergo-sdk';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps, Router, Switch } from 'react-router-dom';

import Layout from './components/common/Layout/Layout';
import {
  AppLoadingProvider,
  SettingsProvider,
  useAppLoadingState,
  WalletAddressesProvider,
  WalletContextProvider,
} from './context';
import { useTheme } from './context/Theme';
import { globalHistory } from './createBrowserHistory';
import { useBodyClass } from './hooks/useBodyClass';
import { Swap } from './pages';

const NotFound = () => <Redirect to="/" />;

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const [{ isKYAAccepted }] = useAppLoadingState();
  if (isKYAAccepted) {
    return React.createElement(Route, props);
  }
  return (
    <Route
      render={({ location }) => (
        <Redirect
          to={{ pathname: '/know-your-assumptions', state: { from: location } }}
        />
      )}
    />
  );
};

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
                  <PrivateRoute path="/" exact component={Swap} />
                  {/*<Route*/}
                  {/*  path="/know-your-assumptions"*/}
                  {/*  exact*/}
                  {/*  component={KnowYourAssumptions}*/}
                  {/*/>*/}
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
