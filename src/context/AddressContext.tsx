import { publicKeyFromAddress } from '@ergolabs/ergo-sdk';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { useSettings } from './SettingsContext';
import { WalletContext } from './WalletContext';

export type Address = string;

export enum WalletAddressState {
  UNCONNECTED = 'unconnected',
  LOADING = 'loading',
  ERROR = 'error',
  LOADED = 'loaded',
  NONE = 'none', // no addresses in wallet
}

export type WalletAddresses =
  | {
      state:
        | WalletAddressState.UNCONNECTED
        | WalletAddressState.LOADING
        | WalletAddressState.NONE;
    }
  | {
      state: WalletAddressState.LOADED;
      addresses: Address[];
      selectedAddress: Address;
    }
  | {
      state: WalletAddressState.ERROR;
      error: string;
    };

const DefaultWalletAddresses: WalletAddresses = {
  state: WalletAddressState.UNCONNECTED,
};

const WalletAddressesContext = createContext<WalletAddresses>(
  DefaultWalletAddresses,
);

type WalletAddressesProviderProps = React.PropsWithChildren<unknown>;

export const WalletAddressesProvider = ({
  children,
}: WalletAddressesProviderProps): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const { isWalletConnected } = useContext(WalletContext);

  const [walletAddresses, setWalletAddress] = useState<WalletAddresses>(
    DefaultWalletAddresses,
  );

  useEffect(() => {
    if (
      isWalletConnected &&
      walletAddresses.state === WalletAddressState.UNCONNECTED
    ) {
      setWalletAddress({ state: WalletAddressState.LOADING });
      loadedAddresses(settings.address).then((data: WalletAddresses) => {
        setWalletAddress(data);
        if (data.state === WalletAddressState.LOADED) {
          setSettings({
            ...settings,
            address: data.selectedAddress,
            pk: publicKeyFromAddress(data.selectedAddress),
          });
        }
      });
    } else if (
      !isWalletConnected &&
      walletAddresses.state !== WalletAddressState.UNCONNECTED
    ) {
      setWalletAddress(DefaultWalletAddresses);
    }
  }, [
    isWalletConnected,
    settings.address,
    walletAddresses.state,
    setSettings,
    settings,
  ]);

  return (
    <WalletAddressesContext.Provider value={walletAddresses}>
      {children}
    </WalletAddressesContext.Provider>
  );
};

export const useWalletAddresses = (): WalletAddresses =>
  useContext(WalletAddressesContext);

async function loadedAddresses(
  selectedAddress?: Address,
): Promise<WalletAddresses> {
  try {
    const usedAddresses = await ergo.get_used_addresses(); // todo: mark used addresses in UI
    const unusedAddresses = await ergo.get_unused_addresses();
    const addresses = unusedAddresses.concat(usedAddresses);
    const selected =
      selectedAddress && addresses.includes(selectedAddress)
        ? selectedAddress
        : addresses[0];

    return {
      state: WalletAddressState.LOADED,
      addresses,
      selectedAddress: selected,
    };
  } catch (e: unknown) {
    return {
      state: WalletAddressState.ERROR,
      error: e instanceof Error ? e.message : 'unknown error',
    };
  }
}
