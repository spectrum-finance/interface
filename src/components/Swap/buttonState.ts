import { isEmpty } from 'ramda';
import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo';
import { AssetInfo } from 'ergo-dex-sdk/build/main';
import { parseUserInputToFractions } from '../../utils/math';

const SUBMIT_TEXT = 'Submit';

export enum States {
  LOADING = 'LOADING',
  PAIR_NOT_SPECIFIED = 'PAIR_NOT_SPECIFIED',
  AMOUNT_NOT_SPECIFIED = 'AMOUNT_NOT_SPECIFIED',
  ADDRESS_NOT_SPECIFIED = 'ADDRESS_NOT_SPECIFIED',
  PENDING_TRANSACTION = 'PENDING_TRANSACTION',
  EMPTY_INPUTS = 'EMPTY_INPUTS',
  INSUFFICIENT_INPUT_TOKEN_BALANCE = 'INSUFFICIENT_INPUT_TOKEN_BALANCE',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  inputAsset?: AssetInfo;
  outputAsset?: AssetInfo;
  inputAmountRaw: string;
  outputAmountRaw: string;
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
  inputAsset,
  outputAsset,
  inputAmountRaw,
  outputAmountRaw,
  chosenAddress,
  utxos,
  availableAmount,
}: ButtonStateDependencies): { type: States; payload?: string } => {
  if (!inputAsset || !outputAsset) {
    return { type: States.LOADING };
  }

  if (!chosenAddress) {
    return { type: States.ADDRESS_NOT_SPECIFIED };
  }

  if (!inputAsset.id || !outputAsset.id) {
    return { type: States.PAIR_NOT_SPECIFIED };
  }

  if (!availableAmount.input && isEmpty(utxos)) {
    return { type: States.PENDING_TRANSACTION };
  }

  if (!inputAmountRaw || !outputAmountRaw) {
    return { type: States.AMOUNT_NOT_SPECIFIED };
  }

  const inputAmount = parseUserInputToFractions(
    inputAmountRaw,
    inputAsset.decimals,
  );

  if (inputAmount > availableAmount.input) {
    return {
      type: States.INSUFFICIENT_INPUT_TOKEN_BALANCE,
      payload: inputAsset.name,
    };
  }

  if (!utxos || utxos.length === 0) {
    return { type: States.EMPTY_INPUTS };
  }

  return { type: States.SUBMIT };
};

export const getButtonState = (deps: ButtonStateDependencies): ButtonState => {
  const state = getState(deps);

  switch (state.type) {
    case States.LOADING: {
      return makeState('Loading...');
    }
    case States.PAIR_NOT_SPECIFIED: {
      return makeState('Pair not specified');
    }
    case States.ADDRESS_NOT_SPECIFIED: {
      return makeState('Address not specified');
    }
    case States.PENDING_TRANSACTION: {
      return makeState('There is a pending transaction');
    }
    case States.AMOUNT_NOT_SPECIFIED: {
      return makeState('Enter Amount');
    }
    case States.EMPTY_INPUTS: {
      return makeState('Insufficient ERG balance');
    }
    case States.INSUFFICIENT_INPUT_TOKEN_BALANCE: {
      return makeState(`Insufficient ${state.payload} balance`);
    }
  }

  return makeState(SUBMIT_TEXT);
};
