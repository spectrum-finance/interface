import './ChooseWalletModal.less';

import React, { useState } from 'react';

import { ReactComponent as YoroiLogo } from '../../../../assets/icons/yoroi-logo-icon.svg';
import { DISCORD_SUPPORT_URL } from '../../../../constants/env';
import { useWallet } from '../../../../context';
import { Alert, Button, Flex, Row, Typography } from '../../../../ergodex-cdk';
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
  const [warning, setWarning] = useState('');
  return (
    <>
      <Row gutter={2}>
        <Button
          onClick={() => {
            onClick()
              .then(() => {
                close(true);
              })
              .catch((err: Error) => {
                setWarning(err.message);
              });
          }}
          className="wallet-item__btn"
          size="large"
        >
          <Body>{name}</Body>
          {logo}
        </Button>
      </Row>
      {warning && (
        <>
          <Flex alignItems="center" justify="center">
            <Alert
              type="warning"
              description={warning}
              style={{ width: '100%' }}
            />
          </Flex>
          <Flex alignItems="center" justify="center">
            <Button type="link" href={DISCORD_SUPPORT_URL} target="_blank">
              Get help in Discord
            </Button>
          </Flex>
        </>
      )}
    </>
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
      onClick: connectYoroiWallet(walletCtx),
    },
  ];

  return (
    <>
      {wallets.map((wallet, index) => (
        <WalletItem key={index} close={close} wallet={wallet} />
      ))}
    </>
  );
};

export { ChooseWalletModal };
