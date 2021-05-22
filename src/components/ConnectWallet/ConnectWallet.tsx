import React, { useCallback, useState } from 'react';
import { Button } from '@geist-ui/react';

interface ConnectWallet {
  isWalletConnected: boolean;
  setIsWalletConnected: (data: boolean) => void;
}

export const ConnectWallet = ({
  isWalletConnected,
  setIsWalletConnected,
}: ConnectWallet) => {
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
