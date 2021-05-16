import React from 'react';
import { Router } from 'react-router-dom';
import { Swap } from './components/Swap/Swap';
import './App.css';
import { globalHistory } from './createBrowserHistory';
import { GeistProvider, CssBaseline, Tabs, Text } from '@geist-ui/react';
import { ConnectWallet } from './components/ConnectWallet/ConnectWallet';

export const App: React.FC = () => {
  return (
    <GeistProvider>
      <CssBaseline />
      <div className="App">
        <Router history={globalHistory}>
          <Text h2>ErgoDex</Text>
          <ConnectWallet />
          <Tabs
            initialValue="swap"
            style={{ maxWidth: '400px', margin: '0 auto' }}
          >
            <Tabs.Item label="home" value="home" />
            <Tabs.Item label="swap" value="swap">
              <Swap />
            </Tabs.Item>
          </Tabs>
        </Router>
      </div>
    </GeistProvider>
  );
};
