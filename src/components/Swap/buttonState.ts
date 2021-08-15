import { isEmpty } from 'ramda';
import { AssetAmount, ErgoBox } from 'ergo-dex-sdk/build/module/ergo';

const SUBMIT_TEXT = 'Submit';

export enum States {
  LOADING = 'LOADING',
  SELECT_A_TOKEN = 'SELECT_A_TOKEN',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  NEED_TO_CHOOSE_ADDRESS = 'NEED_TO_CHOOSE_ADDRESS',
  PENDING_TRANSACTION = 'PENDING_TRANSACTION',
  UTXOS_IS_EMPTY = 'UTXOS_IS_EMPTY',
  INSUFFICIENT_INPUT_TOKEN_BALANCE = 'INSUFFICIENT_INPUT_TOKEN_BALANCE',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  inputAssetAmount?: AssetAmount;
  outputAssetAmount?: AssetAmount;
  inputAmount: string;
  outputAmount: string;
  chosenAddress: string | undefined;
  utxos: ErgoBox[] | undefined;
  availableAmount: { input: bigint; output: bigint };
}

interface ButtonState {
  isDisabled: boolean;
  text: string;
}

const makeState = (text: string): ButtonState => {
  if (text === SUBMIT_TEXT) {
    return { text, isDisabled: false };
  }

  return { text, isDisabled: true };
};

const getState = ({
  inputAssetAmount,
  outputAssetAmount,
  inputAmount,
  outputAmount,
  chosenAddress,
  utxos,
  availableAmount,
}: ButtonStateDependencies): { type: States; payload?: string } => {
  if (!inputAssetAmount || !outputAssetAmount) {
    return { type: States.LOADING };
  }

  if (!chosenAddress) {
    return { type: States.NEED_TO_CHOOSE_ADDRESS };
  }

  if (!inputAssetAmount.asset.id || !outputAssetAmount.asset.id) {
    return { type: States.SELECT_A_TOKEN };
  }

  if (!availableAmount.input && isEmpty(utxos)) {
    return { type: States.PENDING_TRANSACTION };
  }

  if (!inputAmount || !outputAmount) {
    return { type: States.NEED_TO_ENTER_AMOUNT };
  }

  if (inputAssetAmount.amount > availableAmount.input) {
    return {
      type: States.INSUFFICIENT_INPUT_TOKEN_BALANCE,
      payload: inputAssetAmount.asset.name,
    };
  }

  if (!utxos || utxos.length === 0) {
    return { type: States.UTXOS_IS_EMPTY };
  }

  return { type: States.SUBMIT };
};

export const getButtonState = (deps: ButtonStateDependencies): ButtonState => {
  const state = getState(deps);

  switch (state.type) {
    case States.LOADING: {
      return makeState('Loading...');
    }
    case States.SELECT_A_TOKEN: {
      return makeState('Pair not specified');
    }
    case States.NEED_TO_CHOOSE_ADDRESS: {
      return makeState('Address not specified');
    }
    case States.PENDING_TRANSACTION: {
      return makeState('Transaction is pending');
    }
    case States.NEED_TO_ENTER_AMOUNT: {
      return makeState('Enter Amount');
    }
    case States.UTXOS_IS_EMPTY: {
      return makeState('Insufficient ERG balance');
    }
    case States.INSUFFICIENT_INPUT_TOKEN_BALANCE: {
      return makeState(`Insufficient ${state.payload} balance`);
    }
  }

  return makeState(SUBMIT_TEXT);
};
