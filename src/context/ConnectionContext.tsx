import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface ConnectionContextType {
  online: boolean;
}

const ConnectionContext = createContext<ConnectionContextType>({
  online: true,
});

export const useConnection = () => useContext(ConnectionContext);

export const ConnectionContextProvider: FC<React.PropsWithChildren<unknown>> =
  ({ children }) => {
    const [online, setOnline] = useState(window.navigator.onLine);

    useEffect(() => {
      window.addEventListener('online', () => setOnline(true));
      window.addEventListener('offline', () => setOnline(false));
    }, []);

    return (
      <ConnectionContext.Provider value={{ online }}>
        {children}
      </ConnectionContext.Provider>
    );
  };
