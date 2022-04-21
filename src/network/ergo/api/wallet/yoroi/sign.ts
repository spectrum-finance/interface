import {
  ErgoTx,
  ergoTxFromProxy,
  UnsignedErgoTx,
  unsignedErgoTxToProxy,
} from '@ergolabs/ergo-sdk';

export const sign = async (tx: UnsignedErgoTx): Promise<ErgoTx> => {
  const proxy = unsignedErgoTxToProxy(tx);

  const res = await ergo.sign_tx(proxy);
  return ergoTxFromProxy(res);
};
