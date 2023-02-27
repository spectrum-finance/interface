import { ErrorProps } from '../generalProps';
import { RedeemProps } from './props';

export type RedeemEvents = {
  'Redeem Form Submit': RedeemProps;
  'Redeem Modal Confirm': RedeemProps;
  'Redeem Modal Confirm Error': RedeemProps & ErrorProps;
  'Redeem Sign Success': RedeemProps;
  'Redeem Sign Error': RedeemProps & ErrorProps;
};
