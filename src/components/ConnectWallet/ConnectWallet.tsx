import React, { ReactElement, useCallback, useContext } from 'react';
import { Button } from '@geist-ui/react';
import { WalletContext } from '../../context/WalletContext';
import { toast } from 'react-toastify';

export const ConnectWallet = (): ReactElement => {
  const { isWalletConnected, setIsWalletConnected } = useContext(WalletContext);
  const onClick = useCallback(() => {
    if (window.ergo_request_read_access) {
      window
        .ergo_request_read_access()
        .then((data) => setIsWalletConnected(data));
      return;
    }

    toast.warn(
      "Yoroi Nightly and/or Yoroi-dApp-Connector Nightly aren't installed",
    );
  }, [setIsWalletConnected]);

  return (
    <Button type="success" ghost onClick={onClick}>
      {isWalletConnected ? 'Connected' : 'Connect Yoroi Wallet'}
    </Button>
  );
};
