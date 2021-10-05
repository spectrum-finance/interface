import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { RustModule } from '@ergolabs/ergo-sdk';
import { CssBaseline, GeistProvider } from '@geist-ui/react';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps, Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  AppLoadingProvider,
  SettingsProvider,
  useAppLoadingState,
  WalletAddressesProvider,
  WalletContextProvider,
} from './context';
import { globalHistory } from './createBrowserHistory';
import { Home, KnowYourAssumptions } from './pages';

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
  const [isRustModuleLoaded, setIsRustModuleLoaded] = useState(false);

  useEffect(() => {
    RustModule.load().then(() => setIsRustModuleLoaded(true));
  }, []);

  if (!isRustModuleLoaded) {
    return null;
  }

  return (
    <GeistProvider>
      <CssBaseline />
      <Router history={globalHistory}>
        <AppLoadingProvider>
          <WalletContextProvider>
            <SettingsProvider>
              <WalletAddressesProvider>
                <Switch>
                  <PrivateRoute path="/" exact component={Home} />
                  <Route
                    path="/know-your-assumptions"
                    exact
                    component={KnowYourAssumptions}
                  />
                  <Route component={NotFound} />
                </Switch>
              </WalletAddressesProvider>
            </SettingsProvider>
          </WalletContextProvider>
        </AppLoadingProvider>
      </Router>
      <ToastContainer
        style={{ marginTop: '50px' }}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </GeistProvider>
  );
};
