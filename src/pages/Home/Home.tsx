import React from 'react';
import { Tabs } from '@geist-ui/react';
import { Swap } from '../../components/Swap/Swap';
import { Redeem } from '../../components/Redeem/Redeem';
import { Deposit } from '../../components/Deposit/Deposit';
import Layout from '../../components/common/Layout/Layout';
import { CreatePool } from '../../components/CreatePool/CreatePool';

export const Home: React.FC = () => (
  <div className="App">
    <Layout>
      <Tabs initialValue="swap" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Tabs.Item label="swap" value="swap">
          <Swap />
        </Tabs.Item>
        <Tabs.Item label="redeem" value="redeem">
          <Redeem />
        </Tabs.Item>
        <Tabs.Item label="deposit" value="deposit">
          <Deposit />
        </Tabs.Item>
        <Tabs.Item label="pool" value="pool">
          <CreatePool />
        </Tabs.Item>
      </Tabs>
    </Layout>
  </div>
);
