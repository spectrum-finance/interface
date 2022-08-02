import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';

import { Dictionary } from '../../../../../../common/utils/Dictionary';

export interface WorkerBatchMessageData {
  readonly address: string;
  readonly handledTxs: Dictionary<boolean>;
  readonly operations: AmmDexOperation[];
}

export interface WorkerBatchMessage {
  readonly message: 'batch';
  readonly payload: WorkerBatchMessageData;
}
