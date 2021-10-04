import { Tabs } from '@geist-ui/react';
import React from 'react';

import Layout from '../../components/common/Layout/Layout';
import { Deposit } from '../../components/Deposit/Deposit';
import { Redeem } from '../../components/Redeem/Redeem';
import { Swap } from '../../components/Swap/Swap';

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
        {/*<Tabs.Item label="pool" value="pool">*/}
        {/*  <CreatePool />*/}
        {/*</Tabs.Item>*/}
      </Tabs>
    </Layout>
  </div>
);
