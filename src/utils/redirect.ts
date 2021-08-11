import { TxId } from 'ergo-dex-sdk/build/main/ergo';
import { ERG_EXPLORER_URL } from '../constants/env';

export const exploreTx = (txId: TxId): unknown =>
  window.open(`${ERG_EXPLORER_URL}/transactions/${txId}`, '_blank');
