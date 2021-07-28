import { isEmpty } from 'ramda';

export enum States {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  SELECT_A_TOKEN = 'SELECT_A_TOKEN',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  NEED_TO_CHOOSE_ADDRESS = 'NEED_TO_CHOOSE_ADDRESS',
  PENDING_TRANSACTION = 'PENDING_TRANSACTION',
  UTXOS_IS_EMPTY = 'UTXOS_IS_EMPTY',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  isWalletConnected: boolean;
  inputAssetId?: string;
  outputAssetId?: string;
  inputAmount: string;
  outputAmount: string;
  chosenAddress: string | undefined;
  utxos: any;
  availableInputAmount: bigint;
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
  chosenAddress,
  utxos,
  availableInputAmount,
}: ButtonStateDependencies): States => {
  if (!isWalletConnected) {
    return States.NEED_TO_CONNECT_WALLET;
  }

  if (!chosenAddress) {
    return States.NEED_TO_CHOOSE_ADDRESS;
  }

  if (!inputAssetId || !outputAssetId) {
    return States.SELECT_A_TOKEN;
  }

  if (!availableInputAmount && isEmpty(utxos)) {
    return States.PENDING_TRANSACTION;
  }

  if (!inputAmount || !outputAmount) {
    return States.NEED_TO_ENTER_AMOUNT;
  }

  if (!utxos || utxos.length === 0) {
    return States.UTXOS_IS_EMPTY;
  }

  return States.SUBMIT;
};

export const getButtonState = (
  deps: ButtonStateDependencies,
): ButtonState | void => {
  const state = getState(deps);

  switch (state) {
    case States.SELECT_A_TOKEN: {
      return { isDisabled: true, text: 'Pair not specified' };
    }
    case States.SUBMIT: {
      return { isDisabled: false, text: 'Submit' };
    }
    case States.NEED_TO_CONNECT_WALLET: {
      return { isDisabled: true, text: 'Wallet not connected' };
    }
    case States.NEED_TO_CHOOSE_ADDRESS: {
      return { isDisabled: true, text: 'Address not specified' };
    }
    case States.PENDING_TRANSACTION: {
      return {
        isDisabled: true,
        text: 'There is pending transaction. Wait for it to compete.',
      };
    }
    case States.NEED_TO_ENTER_AMOUNT: {
      return { isDisabled: true, text: 'Input amount not specified' };
    }
    case States.UTXOS_IS_EMPTY: {
      return { isDisabled: true, text: 'Insufficient ERG balance' };
    }
    default: {
      return;
    }
  }
};
