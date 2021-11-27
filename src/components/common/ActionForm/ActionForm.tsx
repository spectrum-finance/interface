/* eslint-disable react-hooks/exhaustive-deps */
import { FormProps } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { combineLatest, first, map, Observable, of, startWith } from 'rxjs';

import { Form, FormInstance } from '../../../ergodex-cdk';
import { useObservableAction } from '../../../hooks/useObservable';
import { isWalletLoading$ } from '../../../services/new/core';
import { isOnline$ } from '../../../services/new/networkConnection';
import { ActionButton, ActionButtonState } from './ActionButton/ActionButton';

export interface ActionFormStrategy<T = any> {
  isTokensNotSelected: (form: FormInstance<T>) => boolean | Observable<boolean>;
  isAmountNotEntered: (form: FormInstance<T>) => boolean | Observable<boolean>;
  isLiquidityInsufficient: (
    form: FormInstance<T>,
  ) => boolean | Observable<boolean>;
  getInsufficientTokenForTx: (
    form: FormInstance<T>,
  ) => undefined | string | Observable<undefined | string>;
  getInsufficientTokenForFee: (
    form: FormInstance<T>,
  ) => undefined | string | Observable<undefined | string>;
  request: (form: FormInstance<T>) => Promise<any> | Observable<any> | void;
  actionButtonCaption: () => ReactNode;
}

export interface ActionFormProps {
  readonly form: FormInstance;
  readonly strategy: ActionFormStrategy;
  readonly children?: ReactNode | ReactNode[];
  readonly initialValues?: any;
  readonly onFieldsChange?: FormProps['onFieldsChange'];
  readonly onValuesChange?: (changes: any, value: any, prevValue: any) => void;
}

function normalizeState<T>(value: T | Observable<T>): Observable<T> {
  return value instanceof Observable ? value : of(value);
}

const getButtonData = (
  strategy: ActionFormStrategy,
  form: FormInstance,
  values: any,
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
        console.log('hello', isOnline);
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

export const ActionForm: FC<ActionFormProps> = ({
  form,
  strategy,
  children,
  initialValues,
  onFieldsChange,
  onValuesChange,
}) => {
  const [prevValue, setPrevValue] = useState(initialValues);
  const [buttonData, updateButtonData] = useObservableAction(getButtonData, {
    state: ActionButtonState.CHECK_INTERNET_CONNECTION,
  });
  useEffect(() => {
    (form as any)['onFieldManuallyChange'] = (value: any) => {
      updateButtonData(strategy, form, value);
      setPrevValue(value);
    };
    updateButtonData(strategy, form, form.getFieldsValue());
  }, [strategy, form]);

  const onFormChange = (changedValues: any, values: any) => {
    updateButtonData(strategy, form, values);
    if (onValuesChange) {
      onValuesChange(changedValues, values, prevValue);
    }
    setPrevValue(() => values);
  };
  const handleFieldsChange = (changes: FieldData[], values: any) => {
    if (onFieldsChange) {
      onFieldsChange(changes, values);
    }
  };

  const handleClick = () => {
    const result = strategy.request(form);

    if (result instanceof Observable) {
      result.pipe(first()).subscribe();
    }
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFieldsChange={handleFieldsChange}
      onValuesChange={onFormChange}
    >
      {children}

      <ActionButton
        onClick={handleClick}
        state={buttonData.state}
        token={buttonData.data?.token}
        nativeToken={buttonData.data?.nativeToken}
      >
        {strategy.actionButtonCaption()}
      </ActionButton>
    </Form>
  );
};
