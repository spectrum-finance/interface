import { WalletContextType } from '../../context';
import { walletCookies } from '../cookies';

export const connectYoroiWallet =
  (ctx: WalletContextType) => (): Promise<void> =>
    window
      .ergo_request_read_access()
      .then(ctx.setIsWalletConnected)
      .then(() => walletCookies.setConnected())
      .catch((err) => console.error(err));
