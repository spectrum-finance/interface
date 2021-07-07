import { AmmPool } from 'ergo-dex-sdk';

export enum WalletStates {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  NEED_TO_SELECT_POOL = 'NEED_TO_SELECT_POOL',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  SUBMIT = 'SUBMIT',
}

interface ButtonState {
  isWalletConnected: boolean;
  selectedPool: AmmPool | undefined;
  inputAmount: string;
  outputAmount: string;
}

export const getButtonState = ({
  isWalletConnected,
  selectedPool,
  inputAmount,
  outputAmount,
}: ButtonState): WalletStates => {
  if (!isWalletConnected) {
    return WalletStates.NEED_TO_CONNECT_WALLET;
  }

  if (!selectedPool) {
    return WalletStates.NEED_TO_SELECT_POOL;
  }

  if (Number(inputAmount) <= 0 || Number(outputAmount) <= 0) {
    return WalletStates.NEED_TO_ENTER_AMOUNT;
  }

  return WalletStates.SUBMIT;
};
