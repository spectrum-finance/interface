import {
  AmmOrderStatus,
  TxStatus,
} from '@ergolabs/ergo-dex-sdk/build/main/amm/models/operations';
import { TxId } from '@ergolabs/ergo-sdk';

export type OperationStatus = TxStatus | AmmOrderStatus;
export type OperationType = 'swap' | 'deposit' | 'redeem' | 'refund';

export type OperationAsset = {
  name: string;
  amount?: number;
};

export type Operation = {
  assetX: OperationAsset;
  assetY: OperationAsset;
  type: OperationType;
  status: OperationStatus;
  txId: TxId;
  timestamp: string;
};
