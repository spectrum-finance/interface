import { AmmPool } from '@ergolabs/ergo-dex-sdk';

export enum WalletStates {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  NEED_TO_SELECT_POOL = 'NEED_TO_SELECT_POOL',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  SUBMIT = 'SUBMIT',
}

interface ButtonState {
  isWalletConnected: boolean;
  chosenPool: AmmPool | undefined;
  amount: string;
}

export const getButtonState = ({
  isWalletConnected,
  chosenPool,
  amount,
}: ButtonState): WalletStates => {
  if (!isWalletConnected) {
    return WalletStates.NEED_TO_CONNECT_WALLET;
  }

  if (!chosenPool) {
    return WalletStates.NEED_TO_SELECT_POOL;
  }

  if (!amount) {
    return WalletStates.NEED_TO_ENTER_AMOUNT;
  }

  return WalletStates.SUBMIT;
};
