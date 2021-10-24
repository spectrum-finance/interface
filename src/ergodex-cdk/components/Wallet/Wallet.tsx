import './Wallet.less';

import React, { useState } from 'react';

import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { Tabs } from '../Tabs/Tabs';
import { Address } from './Address';
import { AddressView } from './AddressView';

export const WalletModal: React.FC = () => {
  const [isShownModal, setIsShownModal] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsShownModal(true)}>Open Modal</Button>
      <Modal
        className="wallet-modal-wrapper"
        title="Wallet"
        visible={isShownModal}
        onCancel={() => setIsShownModal(false)}
        footer={null}
      >
        <div>
          <span>Ergo network</span>
          <div className="receive_address">
            <span>Receive address:</span>
            <Address />
          </div>
          <div className="address_tokens_body">
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane tab="Address" key="1">
                <AddressView />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Tokens" key="2" />
            </Tabs>
          </div>
        </div>
      </Modal>
    </div>
  );
};
