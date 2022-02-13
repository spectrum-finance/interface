import Cookies from 'js-cookie';

const WALLET_COOKIE = `ergo-wallet-connected`;

class WalletSettings {
  setConnected(name: string) {
    Cookies.set(WALLET_COOKIE, name, { expires: 1 });
  }

  removeConnected() {
    Cookies.remove(WALLET_COOKIE);
  }

  getConnected() {
    return Cookies.get(WALLET_COOKIE);
  }

  isConnected(name: string) {
    return Cookies.get(WALLET_COOKIE) === name;
  }
}

const walletSettings = new WalletSettings();

export { walletSettings };
