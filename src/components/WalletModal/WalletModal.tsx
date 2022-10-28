import { Box, Button, Flex, Modal, Tabs, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { CSSProperties } from 'react';

import { panalytics } from '../../common/analytics';
import { useObservable } from '../../common/hooks/useObservable';
import { networkAssetBalance$ } from '../../gateway/api/networkAssetBalance';
import { disconnectWallet, selectedWallet$ } from '../../gateway/api/wallets';
import { useSelectedNetwork } from '../../gateway/common/network';
import { patchSettings } from '../../network/ergo/settings/settings';
import { isLowBalance } from '../../utils/walletMath';
import { IsCardano } from '../IsCardano/IsCardano';
import { IsErgo } from '../IsErgo/IsErgo';
import { AddressesTab } from './AddressesTab/AddressesTab';
import { LowBalanceWarning } from './LowBalanceWarning/LowBalanceWarning';
import { TokensTab } from './TokensTab/TokensTab';
import { WalletActiveAddress } from './WalletActiveAddress/WalletActiveAddress';
import { WalletTotalBalance } from './WalletTotalBalance/WalletTotalBalance';

export const WalletModal: React.FC<{ close: (result?: any) => void }> = ({
  close,
}) => {
  const { valBySize } = useDevice();
  const [networkAssetBalance] = useObservable(networkAssetBalance$);
  const [selectedWallet] = useObservable(selectedWallet$);
  const [network] = useSelectedNetwork();

  const handleDisconnectWalletClick = () => {
    panalytics.disconnectWallet(selectedWallet?.name);
    disconnectWallet();
    patchSettings({ ergopay: false });
    close();
  };

  return (
    <>
      <Modal.Title>
        <Flex align="center">
          {selectedWallet?.icon}
          <Flex.Item marginLeft={2}>{selectedWallet?.name}</Flex.Item>
        </Flex>
      </Modal.Title>
      <Modal.Content width={valBySize<CSSProperties['width']>('100%', 470)}>
        <Flex col>
              <Flex.Item marginBottom={4}>
                <WalletTotalBalance balance={networkAssetBalance} />
              </Flex.Item>
              {isLowBalance(Number(networkAssetBalance), network.name) && (
                <Flex.Item marginBottom={4}>
                  <LowBalanceWarning network={network} />
                </Flex.Item>
              )}
              <Flex.Item marginBottom={6}>
                <WalletActiveAddress />
              </Flex.Item>
          <Flex.Item marginBottom={6}>
            <IsErgo>
              <Tabs
                defaultActiveKey={'1'}
                fullWidth
              >
                <Tabs.TabPane tab="Tokens" key="1">
                  <Box transparent padding={[4, 0, 0, 0]} bordered={false}>
                    <TokensTab />
                  </Box>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Addresses" key="2">
                  <Box transparent padding={[4, 0, 0, 0]} bordered={false}>
                    <AddressesTab />
                  </Box>
                </Tabs.TabPane>
              </Tabs>
            </IsErgo>
            <IsCardano>
              <Box transparent padding={0} bordered={false}>
                <TokensTab />
              </Box>
            </IsCardano>
          </Flex.Item>
          <Button
            type="default"
            size="large"
            onClick={handleDisconnectWalletClick}
          >
            <Trans>Disconnect wallet</Trans>
          </Button>
        </Flex>
      </Modal.Content>
    </>
  );
};
