import { AmmPool } from 'ergo-dex-sdk';
import { AssetAmount } from 'ergo-dex-sdk/build/module/ergo';
import { ERG_DECIMALS } from '../../constants/erg';
import { PoolFeeMin, PoolFeeMax } from '../../constants/settings';
import { calculateTotalFee } from '../../utils/transactions';

export enum RedeemFormState {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  NEED_TO_SELECT_TOKENS = 'NEED_TO_SELECT_TOKENS',
  INVALID_POOL_FEE = 'INVALID_POOL_FEE',
  INSUFFICIENT_AMOUNT_FOR_FEES = 'INSUFFICIENT_AMOUNT_FOR_FEES',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  selectedAssetX: AssetAmount | undefined;
  selectedAssetY: AssetAmount | undefined;
  ergBalance: string | undefined;
  poolFee: number | undefined;
  totalFee: number;
}

interface ButtonState {
  isDisabled: boolean;
  text: string;
}

const getState = ({
  selectedAssetX,
  selectedAssetY,
  poolFee,
  ergBalance,
  totalFee,
}: ButtonStateDependencies): RedeemFormState => {
  if (!selectedAssetX || !selectedAssetY) {
    return RedeemFormState.NEED_TO_SELECT_TOKENS;
  }
  if (!poolFee || poolFee <= PoolFeeMin || poolFee > PoolFeeMax) {
    return RedeemFormState.INVALID_POOL_FEE;
  }
  if (!isNaN(Number(ergBalance)) && Number(ergBalance) < Number(totalFee)) {
    return RedeemFormState.INSUFFICIENT_AMOUNT_FOR_FEES;
  }
  return RedeemFormState.SUBMIT;
};

export const getButtonState = (deps: ButtonStateDependencies): ButtonState => {
  const state = getState(deps);

  switch (state) {
    case RedeemFormState.NEED_TO_SELECT_TOKENS: {
      return { isDisabled: true, text: 'Both tokens should be selected' };
    }
    case RedeemFormState.SUBMIT: {
      return { isDisabled: false, text: 'Submit' };
    }
    case RedeemFormState.NEED_TO_CONNECT_WALLET: {
      return { isDisabled: true, text: 'Wallet not connected' };
    }
    case RedeemFormState.INVALID_POOL_FEE: {
      return { isDisabled: true, text: 'Invalid pool fee' };
    }
    case RedeemFormState.INSUFFICIENT_AMOUNT_FOR_FEES: {
      return { isDisabled: true, text: 'Insufficient ERG balance for fees' };
    }
  }
};
