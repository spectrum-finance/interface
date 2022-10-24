import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  LogoutOutlined,
  Modal,
  ModalRef,
  Tag,
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

const { Body } = Typography;

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

const ExperimentalWalletBox = styled(Box)`
  background: var(--spectrum-box-bg-tag);
  border: 1px solid var(--spectrum-default-border-color);

  .dark & {
    background: var(--spectrum-box-bg-contrast);
  }
`;

const WalletView: React.FC<WalletItemProps> = ({
  wallet,
  close,
  isChangeWallet,
}) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<ReactNode | undefined>(undefined);
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

  const handleCheck = () => setChecked((prev) => !prev);

  switch (wallet.definition) {
    case 'experimental':
      return (
        <ExperimentalWalletBox padding={2}>
          <Flex col>
            <Flex.Item marginBottom={2} alignSelf="flex-end">
              <Tag color="gold">
                <Trans>Experimental</Trans>
              </Tag>
            </Flex.Item>
            <Flex.Item marginBottom={2}>
              <Checkbox checked={checked} onChange={handleCheck}>
                <Trans>
                  This wallet may not always work as expected. I understand what
                  I do and will use it at my own risk.
                </Trans>
              </Checkbox>
            </Flex.Item>
            {warning && (
              <Flex.Item marginBottom={2}>
                <Alert
                  type="warning"
                  description={warning}
                  style={{ width: '100%' }}
                />
              </Flex.Item>
            )}
            <WalletButton
              size="large"
              disabled={!checked}
              onClick={handleClick}
              loading={loading}
            >
              <Flex.Item flex={1} display="flex" align="center">
                <Body>{wallet.name}</Body>
              </Flex.Item>
              {wallet.icon}
            </WalletButton>
          </Flex>
        </ExperimentalWalletBox>
      );
    default:
      return (
        <>
          <WalletButton size="large" onClick={handleClick} loading={loading}>
            <Flex.Item flex={1} display="flex" align="center">
              {wallet.name}
            </Flex.Item>
            {wallet.icon}
          </WalletButton>
          {warning && (
            <Flex.Item marginBottom={2}>
              <Alert
                type="warning"
                description={warning}
                style={{ width: '100%' }}
              />
            </Flex.Item>
          )}
        </>
      );
  }
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
      <Modal.Content width={400}>
        <Flex col>
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
