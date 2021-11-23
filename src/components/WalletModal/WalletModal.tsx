import React, { useMemo } from 'react';

import {
  useSettings,
  useWallet,
  useWalletAddresses,
  WalletAddressState,
} from '../../context';
import { Box, Flex, Modal, Typography } from '../../ergodex-cdk';
import { Tabs } from '../../ergodex-cdk/components/Tabs/Tabs';
import { getShortAddress } from '../../utils/string/addres';
import { CopyButton } from '../common/CopyButton/CopyButton';
import { ExploreButton } from '../common/ExploreButton/ExploreButton';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { AddressesTab } from './AddressesTab/AddressesTab';
import { TokensTab } from './TokensTab/TokensTab';

export const WalletModal: React.FC = () => {
  const { ergBalance } = useWallet();

  const walletAddresses = useWalletAddresses();

  const [{ address }] = useSettings();

  const addressList = useMemo(() => {
    return walletAddresses.state === WalletAddressState.LOADED
      ? walletAddresses.addresses
      : [];
  }, [walletAddresses]);

  return (
    <>
      <Modal.Title>Wallet</Modal.Title>
      <Modal.Content width={440}>
        {address && (
          <Flex flexDirection="col">
            <Flex.Item marginTop={-4} marginBottom={4}>
              <Typography.Text className="ergo-network_lbl">
                Ergo network
              </Typography.Text>
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex.Item marginBottom={2}>
                <Typography.Body strong>Total balance</Typography.Body>
              </Flex.Item>
              <Box padding={[2, 3]} borderRadius="m" contrast>
                <Flex justify="space-between" alignItems="center">
                  <Flex.Item>
                    <Flex alignItems="center">
                      <Flex.Item marginRight={1}>
                        <TokenIcon name="erg" />
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Title
                          level={4}
                        >{`${ergBalance} ERG`}</Typography.Title>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                  {/*<Flex.Item>*/}
                  {/*  <Typography.Body>{'~$300'}</Typography.Body>*/}
                  {/*</Flex.Item>*/}
                </Flex>
              </Box>
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex.Item marginBottom={2}>
                <Typography.Body strong>Active address</Typography.Body>
                <InfoTooltip
                  content="You will receive assets on this address"
                  placement="top"
                />
              </Flex.Item>
              <Box padding={[2, 3]} borderRadius="m" contrast>
                <Flex justify="space-between" alignItems="center">
                  <Flex.Item>
                    <Typography.Text>
                      {getShortAddress(address)}
                    </Typography.Text>
                  </Flex.Item>
                  <Flex.Item>
                    <Flex>
                      <Flex.Item marginRight={2}>
                        <CopyButton text={address} />
                      </Flex.Item>
                      <Flex.Item>
                        <ExploreButton to={address} />
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                </Flex>
              </Box>
            </Flex.Item>
            <Flex.Item>
              <Box padding={4} borderRadius="m" contrast>
                <Tabs defaultActiveKey="1" centered type="card">
                  <Tabs.TabPane tab="Address" key="1">
                    <AddressesTab
                      addressList={addressList}
                      activeAddress={address}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab="Tokens"
                    key="2"
                    style={{ overflow: 'auto' }}
                  >
                    <TokensTab />
                  </Tabs.TabPane>
                </Tabs>
              </Box>
            </Flex.Item>
          </Flex>
        )}
      </Modal.Content>
    </>
  );
};
