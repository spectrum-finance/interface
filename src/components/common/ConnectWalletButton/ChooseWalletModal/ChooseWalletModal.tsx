import { Trans } from '@lingui/macro';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  wallets$,
} from '../../../../api/wallets';
import { useObservable } from '../../../../common/hooks/useObservable';
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
import { Wallet } from '../../../../network/common';

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

  &:disabled {
    border-color: var(--ergo-default-border-color) !important;
  }
`;

const ExperimentalBox = styled(Box)`
  background: var(--ergo-box-bg-tag);
  border: 1px solid var(--ergo-default-border-color);

  .dark & {
    background: var(--ergo-box-bg-contrast);
  }
`;

const WalletView: React.FC<WalletItemProps> = ({ wallet, close }) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [warning, setWarning] = useState<ReactNode | undefined>(undefined);

  const handleClick = () => {
    connectWallet(wallet).subscribe(
      (isConnected) => {
        if (typeof isConnected === 'boolean' && isConnected) {
          close(true);
        } else if (isConnected) {
          setWarning(isConnected);
        }
      },
      () => window.open(wallet.extensionLink),
    );
  };

  const handleCheck = () => setChecked((prev) => !prev);

  return wallet.experimental ? (
    <ExperimentalBox padding={2}>
      <Flex col>
        <Flex.Item marginBottom={2} alignSelf="flex-end">
          <Tag color="gold">
            <Trans>Experimental</Trans>
          </Tag>
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <Checkbox checked={checked} onChange={handleCheck}>
            <Trans>
              I understand that this wallet has not been audited. I will use it
              at my own risk.
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
        <WalletButton size="large" disabled={!checked} onClick={handleClick}>
          <Body>{wallet.name}</Body>
          {wallet.icon}
        </WalletButton>
      </Flex>
    </ExperimentalBox>
  ) : (
    <WalletButton size="large" onClick={handleClick}>
      <Body>{wallet.name}</Body>
      {wallet.icon}
    </WalletButton>
  );
};

type ChooseWalletModalProps = DialogRef<boolean>;

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
}): JSX.Element => {
  const [wallets] = useObservable(wallets$, [], []);
  const [selectedWallet] = useObservable(selectedWallet$);

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
              onClick={disconnectWallet}
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
