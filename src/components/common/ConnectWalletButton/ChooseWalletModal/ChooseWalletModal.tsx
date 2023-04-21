import {
  Button,
  Flex,
  Modal,
  ModalRef,
  Tabs,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../common/hooks/useObservable';
import {
  connectWallet,
  selectedWallet$,
  wallets$,
} from '../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { Wallet } from '../../../../network/common/Wallet';
import { ErgoPayTabPaneContent } from '../../../../network/ergo/widgets/ErgoPayModal/ErgoPayTabPaneContent/ErgoPayTabPaneContent';
import { IsCardano } from '../../../IsCardano/IsCardano';
import { IsErgo } from '../../../IsErgo/IsErgo';
import { ProtocolDisclaimerAlert } from './ProtocolDisclaimerAlert/ProtocolDisclaimerAlert';

interface WalletItemProps {
  wallet: Wallet;
  close: (result?: boolean) => void;
}

const WalletButton = styled(Button)`
  align-items: center;
  display: flex;
  height: 4rem;
  width: 100%;

  &:disabled,
  &:disabled:hover {
    border-color: var(--spectrum-default-border-color) !important;
    filter: grayscale(1);

    span {
      color: var(--spectrum-default-border-color) !important;
    }
  }
`;

const WalletView: React.FC<WalletItemProps> = ({ wallet, close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [, setWarning] = useState<ReactNode | undefined>(undefined);
  const [selectedNetwork] = useSelectedNetwork();

  const handleClick = () => {
    setLoading(true);
    connectWallet(wallet).subscribe(
      (isConnected) => {
        setLoading(false);
        if (typeof isConnected === 'boolean' && isConnected) {
          fireAnalyticsEvent('Connect Wallet Success', {
            wallet_name: wallet.name,
            wallet_network: selectedNetwork.name,
          });

          close(true);
        } else if (isConnected) {
          fireAnalyticsEvent('Connect Wallet Error', {
            wallet_name: wallet.name,
            wallet_network: selectedNetwork.name,
            error_string: 'connect wallet error',
          });
          setWarning(isConnected);
        }
      },
      () => {
        setLoading(false);
        fireAnalyticsEvent('Install Wallet Extension Redirect', {
          wallet_name: wallet.name,
          wallet_network: selectedNetwork.name,
        });
        window.open(wallet.extensionLink);
      },
    );
  };

  return (
    <>
      <WalletButton size="large" onClick={handleClick} loading={loading}>
        <Flex.Item flex={1} display="flex" align="center">
          {wallet.name}
        </Flex.Item>
        {wallet.icon}
      </WalletButton>
    </>
  );
};

type ChooseWalletModalProps = ModalRef<boolean>;

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
}): JSX.Element => {
  const [wallets] = useObservable(wallets$, [], []);

  const [selectedWallet] = useObservable(selectedWallet$);

  const walletTab = (
    <Flex.Item marginTop={4} display="flex" col>
      <Flex.Item marginBottom={4}>
        <ProtocolDisclaimerAlert />
      </Flex.Item>
      {wallets
        .filter((w) => !w.hidden)
        .map((wallet, index) => (
          <Flex.Item
            marginBottom={
              index === wallets.length - 1 && !selectedWallet ? 0 : 4
            }
            key={index}
          >
            <WalletView close={close} wallet={wallet} />
          </Flex.Item>
        ))}
    </Flex.Item>
  );

  const { s } = useDevice();
  return (
    <>
      <Modal.Title>
        <Trans>Select a wallet</Trans>
      </Modal.Title>
      <Modal.Content maxWidth={480} width="100%">
        <IsErgo>
          <Tabs fullWidth>
            {s ? (
              <Tabs.TabPane tab={<Trans>ErgoPay</Trans>} key="ergopayMobile">
                <ErgoPayTabPaneContent close={close} />
              </Tabs.TabPane>
            ) : null}
            <Tabs.TabPane
              tab={<Trans>Browser wallet</Trans>}
              key="browse_wallets"
            >
              {walletTab}
            </Tabs.TabPane>
            {!s ? (
              <Tabs.TabPane tab={<Trans>ErgoPay</Trans>} key="ergopayDesktop">
                <ErgoPayTabPaneContent close={close} />
              </Tabs.TabPane>
            ) : null}
          </Tabs>
        </IsErgo>
        <IsCardano>{walletTab}</IsCardano>
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
