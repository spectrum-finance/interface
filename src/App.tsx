import React, { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { Swap } from './components/Swap/Swap';
import './App.css';
import { globalHistory } from './createBrowserHistory';
import { GeistProvider, CssBaseline, Tabs } from '@geist-ui/react';
import { RustModule } from 'ergo-dex-sdk';
import Layout from './components/common/Layout/Layout';
import { WalletContextProvider } from './context/WalletContext';
import { Redeem } from './components/Redeem/Redeem';

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
          <div className="App">
            <Layout>
              <Tabs
                initialValue="swap"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <Tabs.Item label="swap" value="swap">
                  <Swap />
                </Tabs.Item>
                <Tabs.Item label="redeem" value="redeem">
                  <Redeem />
                </Tabs.Item>
              </Tabs>
            </Layout>
          </div>
        </WalletContextProvider>
      </Router>
    </GeistProvider>
  );
};
