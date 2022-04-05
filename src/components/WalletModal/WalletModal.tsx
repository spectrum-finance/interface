import { Trans } from '@lingui/macro';
import React from 'react';

import { useObservable } from '../../common/hooks/useObservable';
import { Box, Button, Flex, Modal, Typography } from '../../ergodex-cdk';
import { Tabs } from '../../ergodex-cdk/components/Tabs/Tabs';
import { networkAssetBalance$ } from '../../gateway/api/networkAssetBalance';
import { isLowBalance } from '../../utils/walletMath';
import { ChooseWalletModal } from '../common/ConnectWalletButton/ChooseWalletModal/ChooseWalletModal';
import { AddressesTab } from './AddressesTab/AddressesTab';
import { LowBalanceWarning } from './LowBalanceWarning/LowBalanceWarning';
import { TokensTab } from './TokensTab/TokensTab';
import { WalletActiveAddress } from './WalletActiveAddress/WalletActiveAddress';
import { WalletTotalBalance } from './WalletTotalBalance/WalletTotalBalance';

export const WalletModal: React.FC = () => {
  const [networkAssetBalance] = useObservable(networkAssetBalance$);

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };

  return (
    <>
      <Modal.Title>
        <Trans>Wallet</Trans>
        <Typography.Paragraph>
          <Trans>Ergo network</Trans>
        </Typography.Paragraph>
      </Modal.Title>
      <Modal.Content width={470}>
        <Flex col>
          <Flex.Item marginBottom={4}>
            <WalletTotalBalance balance={networkAssetBalance} />
          </Flex.Item>
          {isLowBalance(Number(networkAssetBalance)) && (
            <Flex.Item marginBottom={4}>
              <LowBalanceWarning />
            </Flex.Item>
          )}
          <Flex.Item marginBottom={6}>
            <WalletActiveAddress />
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <Box contrast padding={4} borderRadius="m">
              <Tabs defaultActiveKey="1" centered>
                <Tabs.TabPane tab="Addresses" key="1">
                  <Box transparent padding={[4, 0, 0, 0]} bordered={false}>
                    <AddressesTab />
                  </Box>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Tokens" key="2">
                  <Box transparent padding={[4, 0, 0, 0]} bordered={false}>
                    <TokensTab />
                  </Box>
                </Tabs.TabPane>
              </Tabs>
            </Box>
          </Flex.Item>
          <Button type="default" size="large" onClick={openChooseWalletModal}>
            <Trans>Change wallet</Trans>
          </Button>
        </Flex>
      </Modal.Content>
    </>
  );
};
