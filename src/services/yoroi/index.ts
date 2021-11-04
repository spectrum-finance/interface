import { ErgoTx, ergoTxToProxy } from '@ergolabs/ergo-sdk';

export const submitTx = async (tx: ErgoTx): Promise<any> => {
  return await ergo.submit_tx(ergoTxToProxy(tx));
};
