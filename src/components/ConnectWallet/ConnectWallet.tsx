import React, { useCallback, useState } from 'react';
import { Button } from '@geist-ui/react';

export const ConnectWallet: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const onClick = useCallback(() => {
    window.ergo_request_read_access().then((data) => setConnected(data));
  }, []);
  return (
    <Button onClick={onClick}>
      {connected ? 'Connected' : 'Connect Yoroi'}
    </Button>
  );
};
