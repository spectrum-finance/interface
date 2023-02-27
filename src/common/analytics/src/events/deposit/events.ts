import { AmmPoolProps, ErrorProps, TokenProps } from '../generalProps';
import { DepositProps } from './props';

export type DepositEvents = {
  'Deposit Form Submit': DepositProps;
  'Deposit Modal Confirm': DepositProps;
  'Deposit Modal Confirm Error': DepositProps & ErrorProps;
  'Deposit Signed Success': DepositProps;
  'Deposit Signed Error': DepositProps & ErrorProps;
  'Deposit Select X': TokenProps;
  'Deposit Select Y': TokenProps;
  'Deposit Click 25%': undefined;
  'Deposit Click 50%': undefined;
  'Deposit Click 75%': undefined;
  'Deposit Click 100%': undefined;
  'Deposit Click Create Pool': undefined;
  'Deposit Select Pool': AmmPoolProps;
};
