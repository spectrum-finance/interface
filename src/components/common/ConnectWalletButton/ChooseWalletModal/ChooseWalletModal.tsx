import {
  Button,
  Divider,
  Flex,
  LogoutOutlined,
  Modal,
  ModalRef,
  Typography,
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
import { Wallet } from '../../../../network/common/Wallet';
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

  const handleDisconnectWalletClick = () => {
    panalytics.disconnectWallet(selectedWallet?.name);
    disconnectWallet();
  };

  return (
    <>
      <Modal.Title>
        <Trans>Select a wallet</Trans>
      </Modal.Title>
      <Modal.Content maxWidth={480}>
        <Flex col>
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
                <WalletView
                  close={close}
                  wallet={wallet}
                  isChangeWallet={isChangeWallet}
                />
              </Flex.Item>
            ))}
          <IsErgo>
            <Divider />
            <Flex.Item marginBottom={!selectedWallet ? 0 : 4} marginTop={4}>
              <ErgopayWalletButton close={close} />
            </Flex.Item>
          </IsErgo>
          {selectedWallet && (
            <Button
              type="link"
              icon={<LogoutOutlined />}
              onClick={handleDisconnectWalletClick}
            >
              {' '}
              <Trans>Disconnect wallet</Trans>
            </Button>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
