import './WalletModal.less';

import React, { useState } from 'react';

import { Space, Typography } from '../../ergodex-cdk';
import { Tabs } from '../../ergodex-cdk/components/Tabs/Tabs';
import { Address } from './Address';
import { AddressListView } from './AddressListView';
import { TokenListView } from './TokenListView';

export const WalletModal: React.FC = () => {
  const addressList: string[] = [
    '0x8ac34e16940Bf89CF28d1f9C9Fa7E1',
    '0x8a4d4e16940Bf89CF28d1f9C9FaQ4f',
    '0x8af94e16940Bf89CF28d1f9C9Fa7R4',
  ];

  const tokenList = [
    {
      symbol: 'ERG',
      name: 'Ergo',
      iconName: 'erg-orange',
    },
    {
      symbol: 'ADA',
      name: 'Ada',
    },
    {
      symbol: 'ERG',
      name: 'Ergo',
      iconName: 'erg-orange',
    },
    {
      symbol: 'ADA',
      name: 'Ada',
    },
  ];

  const [activeRecvAddr, setActiveRecvAddr] = useState<string>(addressList[0]);

  return (
    <Space
      direction="vertical"
      size={0}
      style={{ width: '100%' }}
      className="wallet-modal-wrapper"
    >
      <Typography.Text className="ergo_network_lbl">
        Ergo network
      </Typography.Text>
      <Space className="receive_address">
        <Typography.Text className="recv_addr_lbl">
          Receive address:
        </Typography.Text>
        <Address address={activeRecvAddr} />
      </Space>
      <Tabs
        defaultActiveKey="1"
        centered
        type="card"
        className="address_tokens_tab"
      >
        <Tabs.TabPane tab="Address" key="1">
          <AddressListView
            addressList={addressList}
            activeAddress={activeRecvAddr}
            updateActiveAddr={setActiveRecvAddr}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tokens" key="2">
          <TokenListView tokenList={tokenList} />
        </Tabs.TabPane>
      </Tabs>
    </Space>
  );
};
