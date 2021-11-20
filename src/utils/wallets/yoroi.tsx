import { WalletContextType } from '../../context';
import { walletCookies } from '../cookies';

enum WARNING_MESSAGE {
  NOT_INSTALLED = 'To use the wallet, first install the Yoroi Google Chrome extension, please.',
  ISSUE = 'Seems like an issue on Yoroi Nightly side.',
}

export const connectYoroiWallet =
  (ctx: WalletContextType) => (): Promise<void | Error> => {
    if (!window.ergo_request_read_access) {
      return Promise.reject(new Error(WARNING_MESSAGE.NOT_INSTALLED));
    }

    return window.ergo_request_read_access().then((isConnected) => {
      if (isConnected) {
        ctx.setIsWalletConnected(isConnected);
        walletCookies.setConnected();
      } else {
        return Promise.reject(new Error(WARNING_MESSAGE.ISSUE));
      }
    });
  };
