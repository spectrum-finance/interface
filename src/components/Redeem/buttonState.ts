import { AmmPool } from 'ergo-dex-sdk';
import { ERG_DECIMALS } from '../../constants/erg';
import { calculateTotalFee } from '../../utils/transactions';

export enum RedeemFormState {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  NEED_TO_SELECT_POOL = 'NEED_TO_SELECT_POOL',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  INSUFFICIENT_AMOUNT_FOR_FEES = 'INSUFFICIENT_AMOUNT_FOR_FEES',
  INSUFFICIENT_LP_AMOUNT = 'INSUFFICIENT_LP_AMOUNT',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  isWalletConnected: boolean;
  selectedPool: AmmPool | undefined;
  amount: string;
  ergBalance: string | undefined;
  minerFee: string;
  dexFee: number;
  LPTokensBalance: string | undefined;
}

interface ButtonState {
  isDisabled: boolean;
  text: string;
}

const getState = ({
  isWalletConnected,
  selectedPool,
  amount,
  ergBalance,
  minerFee,
  dexFee,
  LPTokensBalance,
}: ButtonStateDependencies): RedeemFormState => {
  const totalFee = calculateTotalFee(minerFee, String(dexFee), {
    precision: ERG_DECIMALS,
  });

  if (!isWalletConnected) {
    return RedeemFormState.NEED_TO_CONNECT_WALLET;
  }
  if (!selectedPool) {
    return RedeemFormState.NEED_TO_SELECT_POOL;
  }
  if (!amount) {
    return RedeemFormState.NEED_TO_ENTER_AMOUNT;
  }
  if (!isNaN(Number(ergBalance)) && Number(ergBalance) < Number(totalFee)) {
    return RedeemFormState.INSUFFICIENT_AMOUNT_FOR_FEES;
  }
  if (amount && LPTokensBalance && Number(amount) > Number(LPTokensBalance)) {
    return RedeemFormState.INSUFFICIENT_LP_AMOUNT;
  }
  return RedeemFormState.SUBMIT;
};

export const getButtonState = (deps: ButtonStateDependencies): ButtonState => {
  const state = getState(deps);

  switch (state) {
    case RedeemFormState.NEED_TO_SELECT_POOL: {
      return { isDisabled: true, text: 'Pool not selected' };
    }
    case RedeemFormState.SUBMIT: {
      return { isDisabled: false, text: 'Submit' };
    }
    case RedeemFormState.NEED_TO_CONNECT_WALLET: {
      return { isDisabled: true, text: 'Wallet not connected' };
    }
    case RedeemFormState.NEED_TO_ENTER_AMOUNT: {
      return { isDisabled: true, text: 'LP amount not specified' };
    }
    case RedeemFormState.INSUFFICIENT_AMOUNT_FOR_FEES: {
      return { isDisabled: true, text: 'Insufficient ERG balance for fees' };
    }
    case RedeemFormState.INSUFFICIENT_LP_AMOUNT: {
      return { isDisabled: true, text: 'Insufficient amount of LP tokens' };
    }
  }
};
