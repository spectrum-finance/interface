export enum WalletStates {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  SELECT_A_TOKEN = 'SELECT_A_TOKEN',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  SUBMIT = 'SUBMIT',
}

interface ButtonState {
  isWalletConnected: boolean;
  inputAssetId?: string;
  outputAssetId?: string;
  inputAmount: string;
  outputAmount: string;
}

export const getButtonState = ({
  isWalletConnected,
  inputAssetId,
  outputAssetId,
  inputAmount,
  outputAmount,
}: ButtonState): WalletStates => {
  if (!isWalletConnected) {
    return WalletStates.NEED_TO_CONNECT_WALLET;
  }

  if (!inputAssetId || !outputAssetId) {
    return WalletStates.SELECT_A_TOKEN;
  }

  if (!inputAmount || !outputAmount) {
    return WalletStates.NEED_TO_ENTER_AMOUNT;
  }

  return WalletStates.SUBMIT;
};
