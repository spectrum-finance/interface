import { Address, ErgoTx, ergoTxToProxy } from '@ergolabs/ergo-sdk';
import { Balance } from '@ergolabs/ergo-sdk/build/main/wallet/entities/balance';

import { explorer } from '../explorer';

export const submitTx = async (tx: ErgoTx): Promise<any> => {
  return await ergo.submit_tx(ergoTxToProxy(tx));
};

export const getBalance = async (
  address: Address,
): Promise<Balance | undefined> => {
  return await explorer.getBalanceByAddress(address);
};
