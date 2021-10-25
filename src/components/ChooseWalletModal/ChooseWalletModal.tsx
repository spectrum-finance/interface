import './ChooseWalletModal.less';

import React from 'react';

import { Alert, Button, Row, Typography } from '../../ergodex-cdk';

const { Body } = Typography;

type WalletItemType = {
  name: string;
  logo: JSX.Element;
  onClick: () => void;
  warning?: string;
};

interface WalletItemProps {
  wallet: WalletItemType;
  close: (result: boolean) => void;
}

const WalletItem: React.FC<WalletItemProps> = ({
  wallet: { name, logo, onClick, warning },
  close,
}) => (
  <>
    <Row gutter={1}>
      <Button
        onClick={() => {
          onClick();
          close(true);
        }}
        className="wallet-item__btn"
        size="large"
      >
        <Body>{name}</Body>
        {logo}
      </Button>
    </Row>
    {warning && (
      <Row gutter={1}>
        <Alert type="warning">{warning}</Alert>
      </Row>
    )}
  </>
);

interface ChooseWalletModalProps {
  wallets: Array<WalletItemType>;
  close: (result: boolean) => void;
}

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  wallets,
  close,
}): JSX.Element => (
  <>
    {wallets.map((wallet, index) => {
      return <WalletItem key={index} close={close} wallet={wallet} />;
    })}
  </>
);

export { ChooseWalletModal };
