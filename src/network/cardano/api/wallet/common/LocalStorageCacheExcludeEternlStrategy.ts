import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { Eternl } from '../eternl/eternl';
import { CacheStrategy } from './WalletManager';

export class LocalStorageCacheExcludeEternlStrategy implements CacheStrategy {
  constructor(private key: string) {}

  set(walletId?: string) {
    if (walletId && walletId !== Eternl.id) {
      localStorageManager.set(this.key, walletId);
    } else {
      localStorageManager.remove(this.key);
    }
  }

  get(): string | undefined | null {
    const walletId = localStorageManager.get<string>(this.key);

    if (walletId === Eternl.id) {
      return undefined;
    }
    return walletId;
  }
}
