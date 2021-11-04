import './WalletModal.less';

import React, { useEffect, useMemo, useState } from 'react';

import { Address, useWalletAddresses, WalletAddressState } from '../../context';
import { Box, Col, Row, Typography } from '../../ergodex-cdk';
import { Tabs } from '../../ergodex-cdk/components/Tabs/Tabs';
import { AddressListView } from './AddressListView';
import { AddressView } from './AddressView';
import { TokenListView } from './TokenListView';

export const WalletModal: React.FC = () => {
  const [activeRecvAddr, setActiveRecvAddr] = useState<Address>('');

  const walletAddresses = useWalletAddresses();
  const addressList = useMemo(() => {
    return walletAddresses.state === WalletAddressState.LOADED
      ? walletAddresses.addresses
      : [];
  }, [walletAddresses]);

  useEffect(() => {
    setActiveRecvAddr(addressList[0]);
  }, [addressList]);

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
            <AddressView address={activeRecvAddr} />
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
              <TokenListView />
            </Tabs.TabPane>
          </Tabs>
        </Box>
      </Col>
    </Row>
  );
};
