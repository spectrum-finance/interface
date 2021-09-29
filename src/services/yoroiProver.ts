import {
  ErgoTx,
  Prover,
  UnsignedErgoTx,
  Input as TxInput,
  unsignedErgoTxToProxy,
  ergoTxFromProxy,
} from '@ergolabs/ergo-sdk';

class YoroiProver implements Prover {
  /** Sign the given transaction.
   */
  async sign(tx: UnsignedErgoTx): Promise<ErgoTx> {
    const proxy = unsignedErgoTxToProxy(tx);
    const res = await ergo.sign_tx(proxy);
    return ergoTxFromProxy(res);
  }

  /** Sign particular input of the given transaction.
   */
  signInput(tx: UnsignedErgoTx, input: number): Promise<TxInput> {
    const proxy = unsignedErgoTxToProxy(tx);
    return ergo.sign_tx_input(proxy, input);
  }
}

const yoroiProver = new YoroiProver();
export default yoroiProver;
