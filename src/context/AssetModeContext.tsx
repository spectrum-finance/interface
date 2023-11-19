import { createContext, FC, ReactNode, useContext, useState } from 'react';

interface AssetModeContextType {
  assetMode: 'ADA' | 'USD';
  setAssetMode: (mode: 'ADA' | 'USD') => void;
}

const AssetModeContext = createContext<AssetModeContextType | undefined>(
  undefined,
);

export const AssetModeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [assetMode, setAssetMode] = useState<'ADA' | 'USD'>('ADA');

  return (
    <AssetModeContext.Provider value={{ assetMode, setAssetMode }}>
      {children}
    </AssetModeContext.Provider>
  );
};

export const useAssetMode = () => {
  const context = useContext(AssetModeContext);
  if (!context) {
    throw new Error('useAssetMode must be used within a AssetModeProvider');
  }
  return context;
};
