import { WalletContextType } from '../../context';

export const connectYoroiWallet =
  (ctx: WalletContextType) => (): Promise<void> =>
    window
      .ergo_request_read_access()
      .then(ctx.setIsWalletConnected)
      .catch((err) => console.error(err));
