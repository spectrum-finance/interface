import './WalletModal.less';

import React, { useState } from 'react';

import { Box, Col, Row, Typography } from '../../ergodex-cdk';
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
    <Row className="wallet-modal__wrapper">
      <Col span={24}>
        <Typography.Text className="ergo-network_lbl">
          Ergo network
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Box padding={[2, 3]} borderRadius="m" className="receive_address">
          <Row justify="space-between">
            <Typography.Text className="recv_addr_lbl">
              Receive address:
            </Typography.Text>
            <Address address={activeRecvAddr} />
          </Row>
        </Box>
      </Col>
      <Col span={24}>
        <Box padding={4} borderRadius="m" className="address_tokens__tab">
          <Tabs defaultActiveKey="1" centered type="card">
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
        </Box>
      </Col>
    </Row>
  );
};
