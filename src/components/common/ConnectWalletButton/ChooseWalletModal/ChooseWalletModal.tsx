import { Trans } from '@lingui/macro';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../common/hooks/useObservable';
import { useSettings } from '../../../../context';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  DialogRef,
  Flex,
  LogoutOutlined,
  Modal,
  Tag,
  Typography,
} from '../../../../ergodex-cdk';
import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  wallets$,
} from '../../../../gateway/wallets';
import { Wallet } from '../../../../network/common/Wallet';

const { Body } = Typography;

interface WalletItemProps {
  wallet: Wallet;
  close: (result?: boolean) => void;
}

const WalletButton = styled(Button)`
  align-items: center;
  display: flex;
  height: 4rem;
  justify-content: space-between;
  width: 100%;

  &:disabled,
  &:disabled:hover {
    border-color: var(--ergo-default-border-color) !important;
    filter: grayscale(1);

    span {
      color: var(--ergo-default-border-color) !important;
    }
  }
`;

const ExperimentalWalletBox = styled(Box)`
  background: var(--ergo-box-bg-tag);
  border: 1px solid var(--ergo-default-border-color);

  .dark & {
    background: var(--ergo-box-bg-contrast);
  }
`;

const WalletView: React.FC<WalletItemProps> = ({ wallet, close }) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [warning, setWarning] = useState<ReactNode | undefined>(undefined);
  const [settings, setSettings] = useSettings();

  const handleClick = () => {
    connectWallet(wallet).subscribe(
      (isConnected) => {
        if (typeof isConnected === 'boolean' && isConnected) {
          setSettings({ ...settings, address: undefined, pk: undefined });
          close(true);
        } else if (isConnected) {
          setWarning(isConnected);
        }
      },
      () => window.open(wallet.extensionLink),
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
                  I do andwill use it at my own risk.
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
            >
              <Body>{wallet.name}</Body>
              {wallet.icon}
            </WalletButton>
          </Flex>
        </ExperimentalWalletBox>
      );
    case 'recommended':
      return (
        <Flex col>
          <Flex.Item marginBottom={2} alignSelf="flex-end">
            <Tag color="success">
              <Trans>Recommended</Trans>
            </Tag>
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
          <WalletButton size="large" onClick={handleClick}>
            <Body>{wallet.name}</Body>
            {wallet.icon}
          </WalletButton>
        </Flex>
      );
    default:
      return (
        <WalletButton size="large" onClick={handleClick}>
          {wallet.name}
          {wallet.icon}
        </WalletButton>
      );
  }
};

type ChooseWalletModalProps = DialogRef<boolean>;

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
}): JSX.Element => {
  const [wallets] = useObservable(wallets$, [], []);
  const [selectedWallet] = useObservable(selectedWallet$);
  const [settings, setSettings] = useSettings();

  const handleDisconnectWalletClick = () => {
    setSettings({ ...settings, address: undefined, pk: undefined });
    disconnectWallet();
  };

  return (
    <>
      <Modal.Title>
        <Trans>Select a wallet</Trans>
      </Modal.Title>
      <Modal.Content width={400}>
        <Flex col>
          {wallets.map((wallet, index) => (
            <Flex.Item
              marginBottom={
                index === wallets.length - 1 && !selectedWallet ? 0 : 4
              }
              key={index}
            >
              <WalletView close={close} wallet={wallet} />
            </Flex.Item>
          ))}
          {selectedWallet && (
            <Button
              type="link"
              icon={<LogoutOutlined />}
              onClick={handleDisconnectWalletClick}
            >
              <Trans>Disconnect wallet</Trans>
            </Button>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
