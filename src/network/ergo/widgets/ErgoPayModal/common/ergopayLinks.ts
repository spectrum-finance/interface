import { applicationConfig } from '../../../../../applicationConfig';
import { TxId } from '../../../../../common/types';

export const createUnsignedTxRequestLink = (txId: TxId): string =>
  `${applicationConfig.networksSettings.ergo.ergopayUrl}/get?id=${txId}`;

export const createSelectAddressesRequestLink = (requestId: string): string =>
  `${applicationConfig.networksSettings.ergo.ergopayUrl}/auth?id=${requestId}&address=#P2PK_ADDRESS#`;

export const createErgoPayDeepLink = (requestLink: string): string =>
  requestLink.replace('https', 'ergopay');
