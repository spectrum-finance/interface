import { TxId } from '@ergolabs/ergo-sdk';

import { isHexString } from './string';

export const isTxId = (txId: TxId): boolean =>
  isHexString(txId) && txId.length === 64;

export const getShortTxId = (txId: TxId): string =>
  `${txId.slice(0, 16)}...${txId.slice(48)}`;
