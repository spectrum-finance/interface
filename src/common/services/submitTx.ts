export enum TxSuccessStatus {
  IN_PROGRESS,
  IN_QUEUE,
}

export interface TxSuccess {
  txId: string;
  status: TxSuccessStatus;
}
