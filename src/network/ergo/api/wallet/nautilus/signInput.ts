import { UnsignedErgoTx, unsignedErgoTxToProxy } from '@ergolabs/ergo-sdk';
import { Input as TxInput } from '@ergolabs/ergo-sdk/build/main/entities/input';

export const signInput = async (
  tx: UnsignedErgoTx,
  input: number,
): Promise<TxInput> => {
  const proxy = unsignedErgoTxToProxy(tx);

  return ergoConnector.nautilus
    .getContext()
    .then((context) => context.sign_tx_input(proxy, input));
};
