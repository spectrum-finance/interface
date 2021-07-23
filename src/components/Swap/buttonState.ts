export enum States {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  SELECT_A_TOKEN = 'SELECT_A_TOKEN',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  NEED_TO_CHOOSE_ADDRESS = 'NEED_TO_CHOOSE_ADDRESS',
  UTXOS_IS_EMPTY = 'UTXOS_IS_EMPTY',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  isWalletConnected: boolean;
  inputAssetId?: string;
  outputAssetId?: string;
  inputAmount: string;
  outputAmount: string;
  choosedAddress: string | undefined;
  utxos: any;
}

interface ButtonState {
  isDisabled: boolean;
  text: string;
}

const getState = ({
  isWalletConnected,
  inputAssetId,
  outputAssetId,
  inputAmount,
  outputAmount,
  choosedAddress,
  utxos,
}: ButtonStateDependencies): States => {
  if (!isWalletConnected) {
    return States.NEED_TO_CONNECT_WALLET;
  }

  if (!choosedAddress) {
    return States.NEED_TO_CHOOSE_ADDRESS;
  }

  if (!inputAssetId || !outputAssetId) {
    return States.SELECT_A_TOKEN;
  }

  if (!inputAmount || !outputAmount) {
    return States.NEED_TO_ENTER_AMOUNT;
  }

  if (!utxos || utxos.length === 0) {
    return States.UTXOS_IS_EMPTY;
  }

  return States.SUBMIT;
};

export const getButtonState = ({
  isWalletConnected,
  inputAssetId,
  outputAssetId,
  inputAmount,
  outputAmount,
  choosedAddress,
  utxos,
}: ButtonStateDependencies): ButtonState | void => {
  const state = getState({
    isWalletConnected,
    inputAssetId,
    outputAssetId,
    inputAmount,
    outputAmount,
    choosedAddress,
    utxos,
  });

  switch (state) {
    case States.SELECT_A_TOKEN: {
      return { isDisabled: true, text: 'Need to choose pair' };
    }
    case States.SUBMIT: {
      return { isDisabled: false, text: 'Submit' };
    }
    case States.NEED_TO_CONNECT_WALLET: {
      return { isDisabled: true, text: 'Need to connect wallet' };
    }
    case States.NEED_TO_CHOOSE_ADDRESS: {
      return { isDisabled: true, text: 'Need to choose address' };
    }
    case States.NEED_TO_ENTER_AMOUNT: {
      return { isDisabled: true, text: 'Need to enter amount' };
    }
    case States.UTXOS_IS_EMPTY: {
      return { isDisabled: true, text: 'Insufficient ERG balance' };
    }
    default: {
      return;
    }
  }
};
