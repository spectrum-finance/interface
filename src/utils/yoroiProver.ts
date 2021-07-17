import {
  ErgoTx,
  Prover,
  UnsignedErgoTx,
  Input as TxInput,
} from 'ergo-dex-sdk/build/module/ergo';

export class YoroiProver implements Prover {
  /** Sign the given transaction.
   */
  sign(tx: UnsignedErgoTx): Promise<ErgoTx> {
    return ergo.sign_tx(tx);
  }
  /** Sign particular input of the given transaction.
   */
  signInput(tx: UnsignedErgoTx, input: number): Promise<TxInput> {
    return ergo.sign_tx_input(tx, input);
  }
}
