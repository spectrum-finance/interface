import './ActionButton.less';

import { DateTime } from 'luxon';
import React, { FC, ReactNode } from 'react';
import { interval, map } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable';
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
  ANETA_SWAP_LOCK,
  ACTION,
}

export const END_TIMER_DATE = DateTime.utc(2022, 1, 28, 17, 0, 0);

export const LOCKED_TOKEN_ID =
  '472c3d4ecaa08fb7392ff041ee2e6af75f4a558810a74b28600549d5392810e8';

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
  children: `Insufficient ${token} Balance for Fees`,
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

const getDiff = () =>
  END_TIMER_DATE.diff(DateTime.now().toUTC(), [
    'hour',
    'minute',
    'second',
    'millisecond',
  ]);

// const renderTimer = () =>

const timer$ = interval(1000).pipe(map(() => getDiff()));

export const ActionButton: FC<ActionButtonProps> = (props) => {
  const [timer] = useObservable(timer$, [], getDiff());

  if (props.state === ActionButtonState.ANETA_SWAP_LOCK) {
    return (
      <Button
        htmlType="submit"
        disabled={DateTime.now().toUTC().toMillis() < END_TIMER_DATE.toMillis()}
        onClick={() => {
          if (DateTime.now().toUTC().toMillis() < END_TIMER_DATE.toMillis()) {
            return;
          }
          window.location.reload();
        }}
        style={{ fontSize: '20px', lineHeight: '28px' }}
        size="extra-large"
        block
        type="primary"
      >
        {DateTime.now().toUTC().toMillis() < END_TIMER_DATE.toMillis()
          ? `Swapping is available in ${timer.toFormat('hh:mm:ss')}`
          : `Refresh page`}
      </Button>
    );
  }

  const { children, ...other } = getButtonPropsByState(
    props.state,
    props.token,
    props.nativeToken,
    props.children,
  );

  return (
    <ConnectWalletButton
      className="action-form__connect-btn"
      size="extra-large"
    >
      <Button
        htmlType="submit"
        {...other}
        style={{ fontSize: '20px', lineHeight: '28px' }}
        size="extra-large"
        block
      >
        {children}
      </Button>
    </ConnectWalletButton>
  );
};
