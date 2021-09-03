import Cookies from 'js-cookie';

const WALLET_COOKIE = 'wallet-connected';

class WalletCookies {
  setConnected() {
    Cookies.set(WALLET_COOKIE, 'true', { expires: 1 });
  }

  removeConnected() {
    Cookies.remove(WALLET_COOKIE);
  }

  isSetConnected() {
    return Cookies.get(WALLET_COOKIE) === 'true';
  }
}

const walletCookies = new WalletCookies();

export { walletCookies };
