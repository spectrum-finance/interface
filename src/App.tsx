import React, { useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { globalHistory } from './createBrowserHistory';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { RustModule } from 'ergo-dex-sdk';
import { WalletContextProvider } from './context/WalletContext';
import { SettingsProvider } from './context/SettingsContext';
import { WalletAddressesProvider } from './context/AddressContext';
import { Home, KnowYourAssumptions } from './pages';

const NotFound = () => <Redirect to="/" />;

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
        <WalletContextProvider>
          <SettingsProvider>
            <WalletAddressesProvider>
              <Switch>
                <Route path="/" exact component={Home} />
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
      </Router>
      <ToastContainer
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
