interface WorkerSyncEndMessageData {
  success: boolean;
}

export interface WorkerSyncEndMessage {
  message: 'syncEnd';
  payload: WorkerSyncEndMessageData;
}
