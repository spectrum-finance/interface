import './ActionButton.less';

import React, { FC, ReactNode } from 'react';

import { Button, ButtonProps } from '../../../../ergodex-cdk';
import { ConnectWalletButton } from '../../ConnectWalletButton/ConnectWalletButton';

export enum ActionButtonState {
  SELECT_TOKEN,
  ENTER_AMOUNT,
  INSUFFICIENT_TOKEN_BALANCE,
  INSUFFICIENT_FEE_BALANCE,
  INSUFFICIENT_LIQUIDITY,
  LOADING,
  CHECK_INTERNET_CONNECTION,
  ACTION,
}

const selectTokenState = (): ButtonProps => ({
  children: 'Select a token',
  type: 'primary',
  disabled: true,
});

const enterAmountState = (): ButtonProps => ({
  children: 'Enter an Amount',
  type: 'primary',
  disabled: true,
});

const insufficientTokenBalanceState = (token = ''): ButtonProps => ({
  children: `Insufficient ${token} Balance`,
  type: 'primary',
  disabled: true,
});

const insufficientFeeBalanceState = (token = ''): ButtonProps => ({
  children: `Insufficient ${token} Balance`,
  type: 'primary',
  disabled: true,
});

const insufficientLiquidityState = (): ButtonProps => ({
  children: `Insufficient liquidity for this trade`,
  type: 'primary',
  disabled: true,
});

const loadingState = (): ButtonProps => ({
  children: `Wait a second`,
  type: 'primary',
  loading: true,
});

const checkInternetConnectionState = (): ButtonProps => ({
  children: `Check Internet Connection`,
  type: 'primary',
  disabled: true,
});

const actionState = (caption: ReactNode): ButtonProps => ({
  children: caption,
  type: 'primary',
});

const getButtonPropsByState = (
  state: ActionButtonState,
  token?: string,
  nativeToken?: string,
  caption?: ReactNode,
): ButtonProps => {
  switch (state) {
    case ActionButtonState.CHECK_INTERNET_CONNECTION:
      return checkInternetConnectionState();
    case ActionButtonState.ENTER_AMOUNT:
      return enterAmountState();
    case ActionButtonState.INSUFFICIENT_FEE_BALANCE:
      return insufficientFeeBalanceState(nativeToken);
    case ActionButtonState.INSUFFICIENT_LIQUIDITY:
      return insufficientLiquidityState();
    case ActionButtonState.INSUFFICIENT_TOKEN_BALANCE:
      return insufficientTokenBalanceState(token);
    case ActionButtonState.SELECT_TOKEN:
      return selectTokenState();
    case ActionButtonState.LOADING:
      return loadingState();
    case ActionButtonState.ACTION:
      return actionState(caption);
    default:
      return {};
  }
};

export interface ActionButtonProps {
  readonly state: ActionButtonState;
  readonly token?: string | undefined;
  readonly nativeToken?: string | undefined;
  readonly onClick?: () => void;
  readonly children: ReactNode;
}

export const ActionButton: FC<ActionButtonProps> = (props) => {
  const { children, ...other } = getButtonPropsByState(
    props.state,
    props.token,
    props.nativeToken,
    props.children,
  );

  const handleClick = () => {
    if (props.state === ActionButtonState.ACTION && props.onClick) {
      props.onClick();
    }
  };

  return (
    <ConnectWalletButton
      className="action-form__connect-btn"
      size="extra-large"
    >
      <Button
        {...other}
        size="extra-large"
        style={{ width: '100%' }}
        onClick={handleClick}
      >
        {children}
      </Button>
    </ConnectWalletButton>
  );
};
