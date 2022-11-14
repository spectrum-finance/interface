import { applicationConfig } from '../../../../../applicationConfig';
import { TxId } from '../../../../../common/types';

export const createUnsignedTxRequestLink = (txId: TxId): string =>
  `${applicationConfig.networksSettings.ergo.ergopayUrl}/unsignedTx/${txId}`;

export const createSelectAddressesRequestLink = (requestId: string): string =>
  `${applicationConfig.networksSettings.ergo.ergopayUrl}/addresses/${requestId}/#P2PK_ADDRESS#`;

export const createErgoPayDeepLink = (requestLink: string) =>
  requestLink.replace('https', 'ergopay');
