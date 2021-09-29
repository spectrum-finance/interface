import { ERG_EXPLORER_URL } from '../constants/env';
import { TxId } from '@ergolabs/ergo-sdk';

export const exploreTx = (txId: TxId): unknown =>
  window.open(`${ERG_EXPLORER_URL}/transactions/${txId}`, '_blank');
