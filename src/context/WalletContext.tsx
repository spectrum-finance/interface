import React, { createContext, useState } from 'react';

const WalletContext = createContext({
  isWalletConnected: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsWalletConnected: (isWalletConnected: boolean) => {},
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
