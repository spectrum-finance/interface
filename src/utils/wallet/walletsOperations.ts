import { WalletContextType } from '../../context';
import { walletCookies } from '../cookies';

const WARNING_MESSAGE = {
  YOROI:
    'To use the wallet, please first install the Yoroi Google Chrome extension.',
};

export const connectYoroiWallet =
  (ctx: WalletContextType) => (): Promise<void | Error> => {
    if (!window.ergo_request_read_access) {
      return Promise.reject(new Error(WARNING_MESSAGE.YOROI));
    }

    return window
      .ergo_request_read_access()
      .then(ctx.setIsWalletConnected)
      .then(() => walletCookies.setConnected());
  };
