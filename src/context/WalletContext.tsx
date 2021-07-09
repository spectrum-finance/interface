import React, { createContext, useState } from 'react';

type WalletContextType = {
  isWalletConnected: boolean;
  setIsWalletConnected: (isWalletConnected: boolean) => void;
};

function noop() {
  return;
}

const WalletContext = createContext<WalletContextType>({
  isWalletConnected: false,
  setIsWalletConnected: noop,
});

const WalletContextProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const defaultContext = {
    isWalletConnected,
    setIsWalletConnected,
  };

  return (
    <WalletContext.Provider value={defaultContext}>
      {children}
    </WalletContext.Provider>
  );
};
export { WalletContext, WalletContextProvider };
