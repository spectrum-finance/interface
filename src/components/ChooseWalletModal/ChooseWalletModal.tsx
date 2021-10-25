import './ChooseWalletModal.less';

import React, { useContext, useState } from 'react';

import { ReactComponent as YoroiLogo } from '../../assets/icons/yoroi-logo-icon.svg';
import { WalletContext } from '../../context';
import { Alert, Button, Row, Typography } from '../../ergodex-cdk';
import { walletCookies } from '../../utils/cookies';

const { Body } = Typography;

interface WalletItemProps {
  name: string;
  logo: JSX.Element;
  connect: () => void;
  warning: string;
}

const WalletItem: React.FC<WalletItemProps> = ({
  name,
  logo,
  connect,
  warning,
}) => (
  <>
    <Row gutter={1}>
      <Button onClick={connect} className="wallet-item__btn" size="large">
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

const ChooseWalletModal: React.FC = (): JSX.Element => {
  const { setIsWalletConnected } = useContext(WalletContext);
  const [warning, setWarning] = useState('');

  const walletList = [
    {
      name: 'Yoroi',
      logo: <YoroiLogo />,
      connect: () => {
        if (!window.ergo_request_read_access) {
          console.log('Connect wallet error');
          setWarning('hello');
          return;
        }

        console.log('Connecting');

        window
          .ergo_request_read_access()
          .then(setIsWalletConnected)
          .finally(() => console.log('Connected'));
        // .then(() => walletCookies.setConnected());
      },
    },
  ];

  return (
    <>
      {walletList.map(({ name, logo, connect }, index) => {
        return (
          <WalletItem
            key={index}
            name={name}
            logo={logo}
            connect={connect}
            warning={warning}
          />
        );
      })}
    </>
  );
};

export { ChooseWalletModal };
