import './ChooseWalletModal.less';

import React, { useState } from 'react';

import { ReactComponent as YoroiLogo } from '../../../../assets/icons/yoroi-logo-icon.svg';
import { useWallet } from '../../../../context';
import {
  Alert,
  Button,
  Flex,
  Modal,
  notification,
  Typography,
} from '../../../../ergodex-cdk';
import { connectWallet } from '../../../../services/new/core';
import { connectYoroiWallet } from '../../../../utils/wallets/yoroi';

const { Body } = Typography;

type WalletItemType = {
  name: string;
  logo: JSX.Element;
  onClick: () => Promise<void | Error>;
};

interface WalletItemProps {
  wallet: WalletItemType;
  close: (result: boolean) => void;
}

const WalletItem: React.FC<WalletItemProps> = ({
  wallet: { name, logo, onClick },
  close,
}) => {
  const [warningMessage, setWarningMessage] = useState('');
  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Button
          onClick={() => {
            onClick()
              .then(() => close(true))
              .catch(setWarningMessage);
          }}
          className="wallet-item__btn"
          size="large"
        >
          <Body>{name}</Body>
          {logo}
        </Button>
      </Flex.Item>
      {warningMessage && (
        <Flex align="center" justify="center">
          <Alert
            type="warning"
            description={warningMessage}
            style={{ width: '100%' }}
          />
        </Flex>
      )}
    </Flex>
  );
};

interface ChooseWalletModalProps {
  close: (result: boolean) => void;
}

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
}): JSX.Element => {
  const walletCtx = useWallet();

  const wallets = [
    {
      name: 'Yoroi Nightly',
      logo: <YoroiLogo />,
      onClick: () => {
        return connectYoroiWallet(walletCtx)().then((res) => {
          connectWallet();
          notification.info({
            message: 'Yoroi Nightly tip',
            description:
              'Keep Yoroi Nightly extension window open, when you use ErgoDEX. So that it will sync faster.',
            duration: null,
          });
          return res;
        });
      },
    },
  ];

  return (
    <>
      <Modal.Title>Select a wallet</Modal.Title>
      <Modal.Content width={400}>
        {wallets.map((wallet, index) => (
          <WalletItem key={index} close={close} wallet={wallet} />
        ))}
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
