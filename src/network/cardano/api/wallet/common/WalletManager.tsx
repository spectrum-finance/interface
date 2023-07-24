import { notification } from '@ergolabs/ui-kit';

import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { CardanoNetwork } from './old/CardanoWalletContract';
import { Wallet } from './Wallet';

export type WalletChangeCallback = (wallet: Wallet | undefined) => void;

export interface WalletManager {
  registerWallets: (w: Wallet | Wallet[]) => void;
  getActiveWallet: <T extends Wallet>() => T | undefined;
  setActiveWallet: (wallet: Wallet | string) => Promise<boolean>;
  clearWallet: () => void;
  onWalletChange: (callback: WalletChangeCallback) => () => void;
  availableWallets: Wallet[];
}

export interface CacheStrategy {
  set(walletId?: string): void;

  get(): string | undefined | null;
}

export class LocalStorageCacheStrategy implements CacheStrategy {
  constructor(private key: string) {}

  set(walletId?: string) {
    if (walletId) {
      localStorageManager.set(this.key, walletId);
    } else {
      localStorageManager.remove(this.key);
    }
  }

  get(): string | undefined | null {
    return localStorageManager.get<string>(this.key);
  }
}

export interface CreateWalletManagerParams {
  readonly cacheStrategy?: CacheStrategy;
  readonly availableWallets?: Wallet[];
  readonly network?: CardanoNetwork;
}

export const createWalletManager = (
  params?: CreateWalletManagerParams,
): WalletManager => {
  const activeNetworkId =
    params?.network === undefined ? CardanoNetwork.MAINNET : params?.network;
  const cacheStrategy =
    params?.cacheStrategy ||
    new LocalStorageCacheStrategy('cardano-active-wallet');
  let activeWallet: Wallet | undefined;
  let handleWalletChange: WalletChangeCallback | undefined;
  let availableWallets: Wallet[] = params?.availableWallets || [];
  let intervalId: any;

  const clearWallet = (): void => {
    if (activeWallet) {
      activeWallet.resetContext();
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    cacheStrategy.set(undefined);
    activeWallet = undefined;
    if (handleWalletChange) {
      handleWalletChange(undefined);
    }
  };

  const getActiveWallet = <W extends Wallet>(): W | undefined => {
    if (!activeWallet) {
      return undefined;
    }
    return activeWallet as W;
  };

  const onWalletChange = (callback: WalletChangeCallback) => {
    handleWalletChange = callback;

    return () => {
      handleWalletChange = undefined;
    };
  };

  const assetNetworkId = (
    networkId: CardanoNetwork,
    wallet: Wallet,
  ): Promise<void> => {
    if (networkId === activeNetworkId) {
      return Promise.resolve();
    }

    const networkName =
      networkId === CardanoNetwork.TESTNET ? 'Preview' : 'Mainnet';
    notification.error({
      key: 'wallet_network_error',
      message: 'Wallet Network Error',
      description: (
        <>
          Set network to &quot;{networkName}&quot; in your {wallet.id} wallet to
          use Spectrum Finance interface
        </>
      ),
    });

    return Promise.reject(
      new Error(`Wallet network mismatch. Expected ${networkId}`),
    );
  };

  const registerWallets = (w: Wallet | Wallet[]): void => {
    if (w instanceof Array) {
      availableWallets = [...availableWallets, ...w];
    } else {
      availableWallets = [...availableWallets, w as Wallet];
    }
  };

  const assetIsEnabled = (wallet: Wallet) => {
    wallet.connector.isEnabled().then((isEnabled) => {
      if (!isEnabled) {
        clearWallet();
      }
    });
  };

  const setActiveWallet = (
    wallet: Wallet | string,
    checkEnabling = false,
  ): Promise<boolean> => {
    const walletId = typeof wallet === 'string' ? wallet : wallet.id;
    const walletObject = availableWallets.find((aw) => aw.id === walletId);

    if (!walletObject) {
      return Promise.reject(new Error(`unknown wallet ${walletId}`));
    }
    if (!walletObject.connector) {
      return Promise.reject(
        new Error(`connector for wallet ${walletId} not found`),
      );
    }
    const isEnabledPromise = checkEnabling
      ? walletObject.connector.isEnabled()
      : Promise.resolve(true);

    return isEnabledPromise.then((isEnabled) => {
      return isEnabled
        ? walletObject
            .assertContext((context) => context.getNetworkId())
            .then((networkId) => assetNetworkId(networkId, walletObject))
            .then(() => {
              cacheStrategy.set(walletObject.id);
              activeWallet = walletObject;
              if (handleWalletChange) {
                handleWalletChange(walletObject);
              }
              if (intervalId) {
                clearInterval(intervalId);
              }
              intervalId = setInterval(
                () => assetIsEnabled(walletObject),
                5000,
              );

              return true;
            })
            .catch(() => false)
        : Promise.resolve(false);
    });
  };

  if (cacheStrategy.get()) {
    const walletObject = availableWallets.find(
      (w) => w.id === cacheStrategy.get(),
    );
    if (walletObject) {
      setTimeout(() => {
        setActiveWallet(walletObject, true).catch((isConnected) => {
          if (!isConnected) {
            clearWallet();
          }
        });
      }, 1_000);
    }
  }

  return {
    registerWallets,
    getActiveWallet,
    setActiveWallet,
    onWalletChange,
    clearWallet,
    availableWallets,
  };
};
