import {
  ErgoTx,
  ergoTxFromProxy,
  UnsignedErgoTx,
  unsignedErgoTxToProxy,
} from '@ergolabs/ergo-sdk';
import { CANCEL_REQUEST } from '@ergolabs/ui-kit/dist/components/Modal/presets/Request';

export const sign = async (tx: UnsignedErgoTx): Promise<ErgoTx> => {
  const proxy = unsignedErgoTxToProxy(tx);

  const res = await ergoConnector.nautilus
    .getContext()
    .then((context) => context.sign_tx(proxy))
    .catch((error) => {
      if (error.code === 2) {
        throw CANCEL_REQUEST;
      }
      throw error;
    });
  return ergoTxFromProxy(res);
};
