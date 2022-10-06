import { applicationConfig } from '../../../../../../applicationConfig';
import { TxId } from '../../../../../../common/types';

export const createRequestLink = (txId: TxId): string =>
  `${applicationConfig.networksSettings.ergo.ergopayUrl}unsignedTx/${txId}`;

export const createDeepLink = (txId: TxId): string =>
  createRequestLink(txId).replace('https', 'ergopay');
