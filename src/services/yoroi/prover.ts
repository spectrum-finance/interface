import {
  ErgoTx,
  ergoTxFromProxy,
  Input as TxInput,
  Prover,
  UnsignedErgoTx,
  unsignedErgoTxToProxy,
} from '@ergolabs/ergo-sdk';

// TODO: WALLET_REFACTORING
class YoroiProver implements Prover {
  /** Sign the given transaction.
   */
  async sign(tx: UnsignedErgoTx): Promise<ErgoTx> {
    const proxy = unsignedErgoTxToProxy(tx);

    try {
      const res = await ergo.sign_tx(proxy);
      return ergoTxFromProxy(res);
    } catch {
      const res = await ergoConnector.nautilus
        .getContext()
        .then((context) => context.sign_tx(proxy));
      return ergoTxFromProxy(res);
    }
  }

  /** Sign particular input of the given transaction.
   */
  signInput(tx: UnsignedErgoTx, input: number): Promise<TxInput> {
    const proxy = unsignedErgoTxToProxy(tx);

    try {
      return ergo.sign_tx_input(proxy, input);
    } catch {
      return ergoConnector.nautilus
        .getContext()
        .then((context) => context.sign_tx_input(proxy, input));
    }
  }
}

const yoroiProver = new YoroiProver();
export default yoroiProver;
