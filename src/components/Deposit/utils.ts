import { AmmPool } from 'ergo-dex-sdk';

export enum WalletStates {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  NEED_TO_SELECT_POOL = 'NEED_TO_SELECT_POOL',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  SUBMIT = 'SUBMIT',
}

interface ButtonState {
  isWalletConnected: boolean;
  choosedPool: AmmPool | null;
  firstTokenAmount: string;
  secondTokenAmount: string;
}

export const getButtonState = ({
  isWalletConnected,
  choosedPool,
  firstTokenAmount,
  secondTokenAmount,
}: ButtonState): WalletStates => {
  if (!isWalletConnected) {
    return WalletStates.NEED_TO_CONNECT_WALLET;
  }

  if (!choosedPool) {
    return WalletStates.NEED_TO_SELECT_POOL;
  }

  if (Number(firstTokenAmount) <= 0 || Number(secondTokenAmount) <= 0) {
    return WalletStates.NEED_TO_ENTER_AMOUNT;
  }

  return WalletStates.SUBMIT;
};
