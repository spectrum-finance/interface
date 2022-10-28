import {
  Button,
  Divider,
  Flex,
  LogoutOutlined,
  Modal,
  ModalRef,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { ReactNode, useState } from 'react';
import { noop } from 'rxjs';
import styled from 'styled-components';

import { panalytics } from '../../../../common/analytics';
import { useObservable } from '../../../../common/hooks/useObservable';
import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  wallets$,
} from '../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { Wallet } from '../../../../network/common/Wallet';
import { ErgoPayTabPaneContent } from '../../../../network/ergo/widgets/ErgoPayModal/ErgoPayTabPaneContent/ErgoPayTabPaneContent';
import { ErgopayWalletButton } from '../../../../network/ergo/widgets/ErgopaySwitch/ErgopayWalletButton';
import { IsErgo } from '../../../IsErgo/IsErgo';
import { ProtocolDisclaimerAlert } from './ProtocolDisclaimerAlert/ProtocolDisclaimerAlert';

interface WalletItemProps {
  wallet: Wallet;
  close: (result?: boolean) => void;
  isChangeWallet?: boolean;
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

const ChooseWalletTabs = styled(Tabs)`
  .ant-tabs-ink-bar {
    border-radius: 12px !important;
  }

  .ant-tabs-tab,
  .ant-tabs-nav-list {
    flex-grow: 1;
    width: 100%;
    border-radius: 12px !important;
  }

  .ant-tabs-tab {
    justify-content: center;
    height: 24px;
    border-radius: 12px !important;
  }
`;

const WalletView: React.FC<WalletItemProps> = ({
  wallet,
  close,
  isChangeWallet,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [, setWarning] = useState<ReactNode | undefined>(undefined);
  const [selectedWallet] = useObservable(selectedWallet$);

  const handleClick = () => {
    setLoading(true);
    connectWallet(wallet).subscribe(
      (isConnected) => {
        setLoading(false);
        if (typeof isConnected === 'boolean' && isConnected) {
          selectedWallet?.name === wallet.name
            ? noop()
            : !isChangeWallet
            ? panalytics.connectWallet(wallet.name)
            : panalytics.changeWallet(wallet.name);

          close(true);
        } else if (isConnected) {
          selectedWallet?.name === wallet.name
            ? noop()
            : !isChangeWallet
            ? panalytics.connectWalletError(wallet.name)
            : panalytics.changeWalletError(wallet.name);
          setWarning(isConnected);
        }
      },
      () => {
        setLoading(false);
        selectedWallet?.name === wallet.name
          ? noop()
          : !isChangeWallet
          ? panalytics.connectWalletInstallExtension(wallet.name)
          : panalytics.changeWalletInstallExtension(wallet.name);
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

type ChooseWalletModalProps = ModalRef<boolean> & { isChangeWallet?: boolean };

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
  isChangeWallet,
}): JSX.Element => {
  const [wallets] = useObservable(wallets$, [], []);

  const [selectedWallet] = useObservable(selectedWallet$);
  const [selectedNetwork] = useSelectedNetwork();

  const { s } = useDevice();
  return (
    <>
      <Modal.Title>
        <Trans>Select a wallet</Trans>
      </Modal.Title>
      <Modal.Content maxWidth={480}>
        <ChooseWalletTabs size="middle">
          {selectedNetwork.name === 'ergo' && s ? (
            <ChooseWalletTabs.TabPane tab={<Trans>ErgoPay</Trans>} key="ergopayMobile">
              <ErgoPayTabPaneContent close={close} />
            </ChooseWalletTabs.TabPane>
          ) : null}
          <ChooseWalletTabs.TabPane
            tab={<Trans>Browser wallet</Trans>}
            key="browse_wallets"
          >
            <Flex.Item marginTop={5} display="block">
              {wallets
                .filter((w) => !w.hidden)
                .map((wallet, index) => (
                  <Flex.Item
                    marginBottom={
                      index === wallets.length - 1 && !selectedWallet ? 0 : 4
                    }
                    key={index}
                  >
                    <WalletView
                      close={close}
                      wallet={wallet}
                      isChangeWallet={isChangeWallet}
                    />
                  </Flex.Item>
                ))}
            </Flex.Item>
          </ChooseWalletTabs.TabPane>
          {selectedNetwork.name === 'ergo' && !s ? (
            <ChooseWalletTabs.TabPane tab={<Trans>ErgoPay</Trans>} key="ergopayDesktop">
              <ErgoPayTabPaneContent close={close} />
            </ChooseWalletTabs.TabPane>
          ) : null}
        </ChooseWalletTabs>
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
