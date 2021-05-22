import React, { useState } from 'react';
import { Router } from 'react-router-dom';
import { Swap } from './components/Swap/Swap';
import './App.css';
import { globalHistory } from './createBrowserHistory';
import { GeistProvider, CssBaseline, Tabs, Text } from '@geist-ui/react';
import { ConnectWallet } from './components/ConnectWallet/ConnectWallet';
import { AddLiquidity } from './components/AddLiquidity/AddLiquidity';
import { CreateLiquidity } from './components/CreateLiquidity/CreateLiquidity';

export const App: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <GeistProvider>
      <CssBaseline />
      <div className="App">
        <Router history={globalHistory}>
          <Text h2>ErgoDex</Text>
          <ConnectWallet
            isWalletConnected={isWalletConnected}
            setIsWalletConnected={setIsWalletConnected}
          />
          <Tabs
            initialValue="swap"
            style={{ maxWidth: '400px', margin: '0 auto' }}
          >
            <Tabs.Item label="home" value="home" />
            <Tabs.Item label="swap" value="swap">
              <Swap isWalletConnected={isWalletConnected} />
            </Tabs.Item>
            <Tabs.Item label="add liquidity" value="addLiquidity">
              <AddLiquidity isWalletConnected={isWalletConnected} />
            </Tabs.Item>
            <Tabs.Item label="create liquidity" value="createLiquidity">
              <CreateLiquidity isWalletConnected={isWalletConnected} />
            </Tabs.Item>
          </Tabs>
        </Router>
      </div>
    </GeistProvider>
  );
};
