import { AmmPool } from 'ergo-dex-sdk';

export enum AppState {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  POOL_NOT_SELECTED = 'POOL_NOT_SELECTED',
  AMOUNT_NOT_SPECIFIED = 'AMOUNT_NOT_SPECIFIED',
  SUBMIT = 'SUBMIT',
}

interface ButtonState {
  isWalletConnected: boolean;
  selectedPool: AmmPool | undefined;
  inputAmount: string;
  outputAmount: string;
}

export const getAppState = ({
  isWalletConnected,
  selectedPool,
  inputAmount,
  outputAmount,
}: ButtonState): AppState => {
  if (!isWalletConnected) {
    return AppState.WALLET_NOT_CONNECTED;
  }

  if (!selectedPool) {
    return AppState.POOL_NOT_SELECTED;
  }

  if (Number(inputAmount) <= 0 || Number(outputAmount) <= 0) {
    return AppState.AMOUNT_NOT_SPECIFIED;
  }

  return AppState.SUBMIT;
};
