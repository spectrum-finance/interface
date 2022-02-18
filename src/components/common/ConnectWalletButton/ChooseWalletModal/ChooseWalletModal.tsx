import React, { useState } from 'react';
import styled from 'styled-components';

import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  wallets$,
} from '../../../../api/wallets';
import { useObservable } from '../../../../common/hooks/useObservable';
import {
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
  onClick: (wallet: Wallet) => void;
}

const WalletButton = styled(Button)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const WalletView: React.FC<WalletItemProps> = ({ wallet, onClick }) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheck = () => setChecked((prev) => !prev);

  const handleClick = () => onClick(wallet);

  return wallet.experimental ? (
    <Box tag padding={2}>
      <Flex col>
        <Flex.Item marginBottom={2} alignSelf="flex-end">
          <Tag color="gold">Experimental</Tag>
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <Checkbox checked={checked} onChange={handleCheck}>
            I understand that this wallet has not been audited. I will use it at
            my own risk.
          </Checkbox>
        </Flex.Item>
        <WalletButton size="large" disabled={!checked} onClick={handleClick}>
          <Body>{wallet.name}</Body>
          {wallet.icon}
        </WalletButton>
      </Flex>
    </Box>
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

  const handleWalletClick = (wallet: Wallet) => {
    connectWallet(wallet).subscribe(
      (isConnected) => isConnected && close(true),
      () => window.open(wallet.extensionLink),
    );
  };

  return (
    <>
      <Modal.Title>Select a wallet</Modal.Title>
      <Modal.Content width={400}>
        <Flex col>
          {wallets.map((wallet, index) => (
            <Flex.Item
              marginBottom={
                index === wallets.length - 1 && !selectedWallet ? 0 : 4
              }
              key={index}
            >
              <WalletView onClick={handleWalletClick} wallet={wallet} />
            </Flex.Item>
          ))}
          {selectedWallet && (
            <Button
              type="link"
              icon={<LogoutOutlined />}
              onClick={disconnectWallet}
            >
              Disconnect wallet
            </Button>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
