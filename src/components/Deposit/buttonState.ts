import { AmmPool } from 'ergo-dex-sdk';
import { strToBigInt } from '../../utils/math';

export enum DepositFormStates {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  NEED_TO_SELECT_POOL = 'NEED_TO_SELECT_POOL',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  INSUFFICIENT_AMOUNT_FOR_FEES = 'INSUFFICIENT_AMOUNT_FOR_FEES',
  INSUFFICIENT_AMOUNT_X = 'INSUFFICIENT_AMOUNT_X',
  INSUFFICIENT_AMOUNT_Y = 'INSUFFICIENT_AMOUNT_Y',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  isWalletConnected: boolean;
  selectedPool: AmmPool | undefined;
  inputAmountX: string;
  inputAmountY: string;
  availableInputAmountX: bigint;
  availableInputAmountY: bigint;
  ergBalance: string | undefined;
  minerFee: string;
  dexFee: number;
}

interface ButtonState {
  isDisabled: boolean;
  text: string;
}

export const getState = ({
  isWalletConnected,
  selectedPool,
  inputAmountX,
  inputAmountY,
  availableInputAmountX,
  availableInputAmountY,
  ergBalance,
  minerFee,
  dexFee,
}: ButtonStateDependencies): DepositFormStates => {
  const amountX = strToBigInt(
    inputAmountX,
    selectedPool?.x.asset.decimals ?? 0,
  );
  const amountY = strToBigInt(
    inputAmountY,
    selectedPool?.y.asset.decimals ?? 0,
  );
  const fee = Number(minerFee) + dexFee;

  if (!isWalletConnected) {
    return DepositFormStates.NEED_TO_CONNECT_WALLET;
  }
  if (!selectedPool) {
    return DepositFormStates.NEED_TO_SELECT_POOL;
  }
  if (amountX <= 0n || amountY <= 0n) {
    return DepositFormStates.NEED_TO_ENTER_AMOUNT;
  }
  if (amountX > availableInputAmountX) {
    return DepositFormStates.INSUFFICIENT_AMOUNT_X;
  }
  if (amountY > availableInputAmountY) {
    return DepositFormStates.INSUFFICIENT_AMOUNT_Y;
  }
  if (!isNaN(Number(ergBalance)) && Number(ergBalance) < fee) {
    return DepositFormStates.INSUFFICIENT_AMOUNT_FOR_FEES;
  }

  return DepositFormStates.SUBMIT;
};

export const getButtonState = (deps: ButtonStateDependencies): ButtonState => {
  const state = getState(deps);
  const { selectedPool } = deps;
  switch (state) {
    case DepositFormStates.NEED_TO_SELECT_POOL: {
      return { isDisabled: true, text: 'Wallet not selected' };
    }
    case DepositFormStates.SUBMIT: {
      return { isDisabled: false, text: 'Submit' };
    }
    case DepositFormStates.NEED_TO_CONNECT_WALLET: {
      return { isDisabled: true, text: 'Wallet not connected' };
    }
    case DepositFormStates.NEED_TO_ENTER_AMOUNT: {
      return { isDisabled: true, text: 'Amount not specified' };
    }
    case DepositFormStates.INSUFFICIENT_AMOUNT_FOR_FEES: {
      return { isDisabled: true, text: 'Insufficient ERG balance for fees' };
    }
    case DepositFormStates.INSUFFICIENT_AMOUNT_X: {
      return {
        isDisabled: true,
        text: `Insufficient ${selectedPool?.x.asset?.name ?? ''} balance`,
      };
    }
    case DepositFormStates.INSUFFICIENT_AMOUNT_Y: {
      return {
        isDisabled: true,
        text: `Insufficient ${selectedPool?.y.asset?.name ?? ''} balance`,
      };
    }
  }
};
