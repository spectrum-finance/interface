import {
  AmmOrderStatus,
  TxStatus,
} from '@ergolabs/ergo-dex-sdk/build/main/amm/models/operations';
import { TxId } from '@ergolabs/ergo-sdk';

import { Currency } from '../../../common/models/Currency';

export type OperationStatus = TxStatus | AmmOrderStatus;
export type OperationType = 'swap' | 'deposit' | 'redeem' | 'refund';

export type Operation = {
  assetX: Currency;
  assetY: Currency;
  type: OperationType;
  status: OperationStatus;
  txId: TxId;
  timestamp: string;
};
