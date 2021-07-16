import {
  ErgoTx,
  Prover,
  UnsignedErgoTx,
  Input as TxInput,
  unsignedErgoTxToProxy,
  ergoTxFromProxy,
} from 'ergo-dex-sdk/build/module/ergo';

export class YoroiProver implements Prover {
  /** Sign the given transaction.
   */
  sign(tx: UnsignedErgoTx): Promise<ErgoTx> {
    const proxyTx = unsignedErgoTxToProxy(tx);
    return ergo.sign_tx(proxyTx).then((tx) => ergoTxFromProxy(tx));
  }
  /** Sign particular input of the given transaction.
   */
  signInput(tx: UnsignedErgoTx, input: number): Promise<TxInput> {
    const proxyTx = unsignedErgoTxToProxy(tx);
    return ergo.sign_tx_input(proxyTx, input);
  }
}
