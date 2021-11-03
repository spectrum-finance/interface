import { ErgoTx, ergoTxToProxy } from '@ergolabs/ergo-sdk';

import { Address } from '../../context';
import { explorer } from '../../services/explorer';

export const submitTx = async (tx: ErgoTx): Promise<any> => {
  return await ergo.submit_tx(ergoTxToProxy(tx));
};

export const getBalance = async (address: Address): Promise<any> => {
  const balance = await explorer.getBalanceByAddress(address);
  return balance;
};
