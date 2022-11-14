import { createContext } from 'react';

import { Currency } from '../../../common/models/Currency';

export enum ActionButtonState {
  SELECT_TOKEN,
  ENTER_AMOUNT,
  INSUFFICIENT_TOKEN_BALANCE,
  INSUFFICIENT_FEE_BALANCE,
  INSUFFICIENT_REFUNDABLE_DEPOSIT_BALANCE,
  INSUFFICIENT_LIQUIDITY,
  LOADING,
  PROCESSING_TRANSACTION,
  CHECK_INTERNET_CONNECTION,
  SWAP_LOCK,
  MIN_VALUE,
  ACTION,
}

interface ActionFormContextValue {
  readonly state: ActionButtonState;
  readonly token?: string;
  readonly nativeToken?: string;
  readonly currency?: Currency;
}

export const ActionFormContext = createContext<ActionFormContextValue>({
  state: ActionButtonState.CHECK_INTERNET_CONNECTION,
});
