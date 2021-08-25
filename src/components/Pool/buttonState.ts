import { AssetAmount } from 'ergo-dex-sdk/build/module/ergo';
import { PoolFeeMin, PoolFeeMax } from '../../constants/settings';

export enum PoolFormState {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  NEED_TO_SELECT_TOKENS = 'NEED_TO_SELECT_TOKENS',
  INVALID_POOL_FEE = 'INVALID_POOL_FEE',
  INSUFFICIENT_AMOUNT_FOR_FEES = 'INSUFFICIENT_AMOUNT_FOR_FEES',
  INVALID_AMOUNT_X = 'INVALID_AMOUNT_X',
  INVALID_AMOUNT_Y = 'INVALID_AMOUNT_Y',
  INSUFFICIENT_AMOUNT_X = 'INSUFFICIENT_AMOUNT_X',
  INSUFFICIENT_AMOUNT_Y = 'INSUFFICIENT_AMOUNT_Y',
  SUBMIT = 'SUBMIT',
}

interface ButtonStateDependencies {
  selectedAssetX: AssetAmount | undefined;
  selectedAssetY: AssetAmount | undefined;
  assetAmountX: bigint | undefined;
  assetAmountY: bigint | undefined;
  availableInputAmountX: bigint;
  availableInputAmountY: bigint;
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
  assetAmountX,
  assetAmountY,
  availableInputAmountX,
  availableInputAmountY,
  poolFee,
  ergBalance,
  totalFee,
}: ButtonStateDependencies): PoolFormState => {
  if (!selectedAssetX || !selectedAssetY) {
    return PoolFormState.NEED_TO_SELECT_TOKENS;
  }
  if (!isNaN(Number(ergBalance)) && Number(ergBalance) < Number(totalFee)) {
    return PoolFormState.INSUFFICIENT_AMOUNT_FOR_FEES;
  }
  if (assetAmountX && assetAmountX > availableInputAmountX) {
    return PoolFormState.INSUFFICIENT_AMOUNT_X;
  }
  if (assetAmountY && assetAmountY > availableInputAmountY) {
    return PoolFormState.INSUFFICIENT_AMOUNT_Y;
  }
  if (!assetAmountX) {
    return PoolFormState.INVALID_AMOUNT_X;
  }
  if (!assetAmountY) {
    return PoolFormState.INVALID_AMOUNT_Y;
  }
  if (!poolFee || poolFee <= PoolFeeMin || poolFee > PoolFeeMax) {
    return PoolFormState.INVALID_POOL_FEE;
  }
  return PoolFormState.SUBMIT;
};

export const getButtonState = (deps: ButtonStateDependencies): ButtonState => {
  const state = getState(deps);
  const { selectedAssetX, selectedAssetY } = deps;

  const assetXName = selectedAssetX?.asset.name ?? '';
  const assetYName = selectedAssetY?.asset.name ?? '';

  switch (state) {
    case PoolFormState.NEED_TO_SELECT_TOKENS: {
      return { isDisabled: true, text: 'Both tokens should be selected' };
    }
    case PoolFormState.SUBMIT: {
      return { isDisabled: false, text: 'Submit' };
    }
    case PoolFormState.NEED_TO_CONNECT_WALLET: {
      return { isDisabled: true, text: 'Wallet not connected' };
    }
    case PoolFormState.INSUFFICIENT_AMOUNT_FOR_FEES: {
      return { isDisabled: true, text: 'Insufficient ERG balance for fees' };
    }
    case PoolFormState.INSUFFICIENT_AMOUNT_X: {
      return { isDisabled: true, text: `Insufficient ${assetXName} balance` };
    }
    case PoolFormState.INSUFFICIENT_AMOUNT_Y: {
      return { isDisabled: true, text: `Insufficient ${assetYName} balance` };
    }
    case PoolFormState.INVALID_AMOUNT_X: {
      return { isDisabled: true, text: `Invalid ${assetXName} balance` };
    }
    case PoolFormState.INVALID_AMOUNT_Y: {
      return { isDisabled: true, text: `Invalid ${assetYName} balance` };
    }
    case PoolFormState.INVALID_POOL_FEE: {
      return { isDisabled: true, text: 'Invalid pool fee' };
    }
  }
};
