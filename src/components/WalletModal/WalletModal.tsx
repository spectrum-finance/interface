import React from 'react';

import { Box, Flex, Modal, Typography } from '../../ergodex-cdk';
import { Tabs } from '../../ergodex-cdk/components/Tabs/Tabs';
import { useObservable } from '../../hooks/useObservable';
import { nativeToken$, nativeTokenBalance$ } from '../../services/new/core';
import { selectedNetwork$ } from '../../services/new/network';
import { isLowBalance } from '../../utils/walletMath';
import { AddressesTab } from './AddressesTab/AddressesTab';
import { LowBalanceWarning } from './LowBalanceWarning/LowBalanceWarning';
import { TokensTab } from './TokensTab/TokensTab';
import { WalletActiveAddress } from './WalletActiveAddress/WalletActiveAddress';
import { WalletTotalBalance } from './WalletTotalBalance/WalletTotalBalance';

export const WalletModal: React.FC = () => {
  const [nativeTokenBalance] = useObservable(nativeTokenBalance$);
  const [nativeToken] = useObservable(nativeToken$);
  const [selectedNetwork] = useObservable(selectedNetwork$);

  return (
    <>
      <Modal.Title>
        Wallet
        <Typography.Paragraph>
          {selectedNetwork?.name} network
        </Typography.Paragraph>
      </Modal.Title>
      <Modal.Content width={440}>
        <Flex col>
          <Flex.Item marginBottom={4}>
            <WalletTotalBalance
              balance={nativeTokenBalance}
              token={nativeToken}
            />
          </Flex.Item>
          {isLowBalance(Number(nativeTokenBalance)) && (
            <Flex.Item marginBottom={4}>
              <LowBalanceWarning />
            </Flex.Item>
          )}
          <Flex.Item marginBottom={6}>
            <WalletActiveAddress />
          </Flex.Item>
          <Flex.Item>
            <Box contrast padding={4} borderRadius="m">
              <Tabs defaultActiveKey="1" centered type="card">
                <Tabs.TabPane tab="Address" key="1">
                  <Box transparent padding={[4, 0, 0, 0]}>
                    <AddressesTab />
                  </Box>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Tokens" key="2">
                  <Box transparent padding={[4, 0, 0, 0]}>
                    <TokensTab />
                  </Box>
                </Tabs.TabPane>
              </Tabs>
            </Box>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};
