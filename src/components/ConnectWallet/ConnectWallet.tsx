import React, { ReactElement, useCallback, useContext } from 'react';
import { Button } from '@geist-ui/react';
import { WalletContext } from '../../context/WalletContext';

export const ConnectWallet = (): ReactElement => {
  const { isWalletConnected, setIsWalletConnected } = useContext(WalletContext);
  const onClick = useCallback(() => {
    window
      .ergo_request_read_access()
      .then((data) => setIsWalletConnected(data));
  }, []);

  return (
    <Button onClick={onClick}>
      {isWalletConnected ? 'Connected' : 'Connect Yoroi'}
    </Button>
  );
};
