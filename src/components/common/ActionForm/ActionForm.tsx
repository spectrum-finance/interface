/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, ReactNode } from 'react';
import { combineLatest, first, map, Observable, of } from 'rxjs';

import { Flex } from '../../../ergodex-cdk';
import { Form, FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { useSubject, useSubscription } from '../../../hooks/useObservable';
import { isWalletLoading$ } from '../../../services/new/core';
import { isOnline$ } from '../../../services/new/networkConnection';
import { ActionButton, ActionButtonState } from './ActionButton/ActionButton';

export interface ActionFormStrategy<T = any> {
  isTokensNotSelected: (form: T) => boolean | Observable<boolean>;
  isAmountNotEntered: (form: T) => boolean | Observable<boolean>;
  isLiquidityInsufficient: (form: T) => boolean | Observable<boolean>;
  getInsufficientTokenForTx: (
    form: T,
  ) => undefined | string | Observable<undefined | string>;
  getInsufficientTokenForFee: (
    form: T,
  ) => undefined | string | Observable<undefined | string>;
  request: (form: T) => Promise<any> | Observable<any> | void;
  actionButtonCaption: () => ReactNode;
}

export interface ActionFormProps<T> {
  readonly form: FormGroup<T>;
  readonly strategy: any;
  readonly children?: ReactNode | ReactNode[];
}

function normalizeState<T>(value: T | Observable<T>): Observable<T> {
  return value instanceof Observable ? value : of(value);
}

const getButtonData = (
  strategy: ActionFormStrategy,
  form: any,
): Observable<{
  state: ActionButtonState;
  data?: any;
}> => {
  const isTokensNotSelected$ = normalizeState(
    strategy.isTokensNotSelected(form),
  );
  const isAmountNotEntered$ = normalizeState(strategy.isAmountNotEntered(form));
  const insufficientTokenForTx$ = normalizeState(
    strategy.getInsufficientTokenForTx(form),
  );
  const insufficientTokenForFee$ = normalizeState(
    strategy.getInsufficientTokenForFee(form),
  );
  const isLiquidityInsufficient$ = normalizeState(
    strategy.isLiquidityInsufficient(form),
  );

  return combineLatest([
    isWalletLoading$,
    isOnline$,
    isTokensNotSelected$,
    isAmountNotEntered$,
    insufficientTokenForTx$,
    insufficientTokenForFee$,
    isLiquidityInsufficient$,
  ]).pipe(
    map(
      ([
        isWalletLoading,
        isOnline,
        isTokenNotSelected,
        isAmountNotEntered,
        insufficientTokenForTx,
        insufficientTokenForFee,
        isLiquidityInsufficient,
      ]) => {
        if (!isOnline) {
          return { state: ActionButtonState.CHECK_INTERNET_CONNECTION };
        } else if (isWalletLoading) {
          return { state: ActionButtonState.LOADING };
        } else if (isTokenNotSelected) {
          return { state: ActionButtonState.SELECT_TOKEN };
        } else if (isAmountNotEntered) {
          return { state: ActionButtonState.ENTER_AMOUNT };
        } else if (insufficientTokenForTx) {
          return {
            state: ActionButtonState.INSUFFICIENT_TOKEN_BALANCE,
            data: { token: insufficientTokenForTx },
          };
        } else if (insufficientTokenForFee) {
          return {
            state: ActionButtonState.INSUFFICIENT_FEE_BALANCE,
            data: { nativeToken: insufficientTokenForFee },
          };
        } else if (isLiquidityInsufficient) {
          return { state: ActionButtonState.INSUFFICIENT_LIQUIDITY };
        } else {
          return { state: ActionButtonState.ACTION };
        }
      },
    ),
    // startWith({ state: ActionButtonState.LOADING }),
  );
};

export const ActionForm: FC<ActionFormProps<any>> = ({
  form,
  strategy,
  children,
}) => {
  const [buttonData, updateButtonData] = useSubject(getButtonData, {
    defaultValue: {
      state: ActionButtonState.CHECK_INTERNET_CONNECTION,
    },
  });

  useSubscription(
    form.valueChangesWithSilent$,
    (value: any) => {
      updateButtonData(strategy, value);
    },
    [strategy],
  );

  const handleSubmit = () => {
    if (buttonData.state !== ActionButtonState.ACTION) {
      return;
    }

    const result = strategy.request(form);

    if (result instanceof Observable) {
      result.pipe(first()).subscribe();
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      {children}
      <Flex.Item marginTop={4}>
        <ActionButton
          onClick={handleSubmit}
          state={buttonData.state}
          token={buttonData.data?.token}
          nativeToken={buttonData.data?.nativeToken}
        >
          {strategy.actionButtonCaption()}
        </ActionButton>
      </Flex.Item>
    </Form>
  );
};
