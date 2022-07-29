import './ActionButton.less';

import { Button, ButtonProps } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { FC, ReactNode, useContext } from 'react';
import { interval, map } from 'rxjs';

import { PAnalytics } from '../../../../common/analytics/@types/types';
import { useObservable } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { ConnectWalletButton } from '../../ConnectWalletButton/ConnectWalletButton';
import { ActionButtonState, ActionFormContext } from '../ActionFormContext';

export const END_TIMER_DATE = DateTime.utc(2022, 2, 2, 19, 0, 0);

export const LOCKED_TOKEN_ID =
  'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413';

const selectTokenState = (): ButtonProps => ({
  children: t`Select a token`,
  type: 'primary',
  disabled: true,
});

const enterAmountState = (): ButtonProps => ({
  children: t`Enter an Amount`,
  type: 'primary',
  disabled: true,
});

const insufficientTokenBalanceState = (token = ''): ButtonProps => ({
  children: t`Insufficient ${token} Balance`,
  type: 'primary',
  disabled: true,
});

const insufficientFeeBalanceState = (token = ''): ButtonProps => ({
  children: t`Insufficient ${token} Balance for Fees`,
  type: 'primary',
  disabled: true,
});

const minValueState = (c?: Currency): ButtonProps => ({
  children: t`Min value for ${c?.asset.ticker} is ${c?.toString()}`,
  type: 'primary',
  disabled: true,
});

const insufficientLiquidityState = (): ButtonProps => ({
  children: t`Insufficient liquidity for this trade`,
  type: 'primary',
  disabled: true,
});

const loadingState = (): ButtonProps => ({
  children: t`Loading`,
  type: 'primary',
  loading: true,
});

const ProcessingTransactionState = (): ButtonProps => ({
  children: t`Processing transaction`,
  type: 'primary',
  loading: true,
});

const checkInternetConnectionState = (): ButtonProps => ({
  children: t`Check Internet Connection`,
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
  currency?: Currency,
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
    case ActionButtonState.MIN_VALUE:
      return minValueState(currency);
    case ActionButtonState.LOADING:
      return loadingState();
    case ActionButtonState.PROCESSING_TRANSACTION:
      return ProcessingTransactionState();
    case ActionButtonState.ACTION:
      return actionState(caption);
    default:
      return {};
  }
};

export interface ActionButtonProps {
  readonly children: ReactNode;
  readonly analytics?: PAnalytics;
}

const getDiff = () =>
  END_TIMER_DATE.diff(DateTime.now().toUTC(), [
    'hour',
    'minute',
    'second',
    'millisecond',
  ]);

const timer$ = interval(1000).pipe(map(() => getDiff()));

export const ActionButton: FC<ActionButtonProps> = (props) => {
  const [timer] = useObservable(timer$, [], getDiff());
  const formContext = useContext(ActionFormContext);

  if (formContext.state === ActionButtonState.SWAP_LOCK) {
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
          ? t`Swapping is available in ${timer.toFormat('hh:mm:ss')}`
          : t`Refresh page`}
      </Button>
    );
  }

  const { children, ...other } = getButtonPropsByState(
    formContext.state,
    formContext.token,
    formContext.nativeToken,
    formContext.currency,
    props.children,
  );

  return (
    <ConnectWalletButton
      className="action-form__connect-btn"
      size="extra-large"
      analytics={props.analytics}
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
