export enum WalletStates {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  SELECT_A_TOKEN = 'SELECT_A_TOKEN',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  SUBMIT = 'SUBMIT',
}

interface ButtonState {
  isWalletConnected: boolean;
  firstTokenId: string;
  secondTokenId: string;
  firstTokenAmount: string;
  secondTokenAmount: string;
}

export const getButtonState = ({
  isWalletConnected,
  firstTokenId,
  secondTokenId,
  firstTokenAmount,
  secondTokenAmount,
}: ButtonState): WalletStates => {
  if (!isWalletConnected) {
    return WalletStates.NEED_TO_CONNECT_WALLET;
  }

  if (!firstTokenId || !secondTokenId) {
    return WalletStates.SELECT_A_TOKEN;
  }

  if (!firstTokenAmount || !secondTokenAmount) {
    return WalletStates.NEED_TO_ENTER_AMOUNT;
  }

  return WalletStates.SUBMIT;
};
