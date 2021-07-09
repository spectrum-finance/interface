export enum States {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  SELECT_A_TOKEN = 'SELECT_A_TOKEN',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  NEED_TO_CHOOSE_ADDRESS = 'NEED_TO_CHOOSE_ADDRESS',
  UTXOS_IS_EMPTY = 'UTXOS_IS_EMPTY',
  SUBMIT = 'SUBMIT',
}

interface Props {
  isWalletConnected: boolean;
  inputAssetId?: string;
  outputAssetId?: string;
  inputAmount: string;
  outputAmount: string;
  choosedAddress: string | undefined;
  utxos: any;
}

const getState = ({
  isWalletConnected,
  inputAssetId,
  outputAssetId,
  inputAmount,
  outputAmount,
  choosedAddress,
  utxos,
}: Props): States => {
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
}: Props): { disabled: boolean; text: string } => {
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
      return { disabled: true, text: 'Need to choose pair' };
    }
    case States.SUBMIT: {
      return { disabled: false, text: 'Submit' };
    }
    case States.NEED_TO_CONNECT_WALLET: {
      return { disabled: true, text: 'Need to connect wallet' };
    }
    case States.NEED_TO_CHOOSE_ADDRESS: {
      return { disabled: true, text: 'Need to choose address' };
    }
    case States.NEED_TO_ENTER_AMOUNT: {
      return { disabled: true, text: 'Need to enter amount' };
    }
    case States.UTXOS_IS_EMPTY: {
      return { disabled: true, text: 'Wallet is empty' };
    }
  }
};
