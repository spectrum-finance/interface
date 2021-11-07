/* eslint-disable react-hooks/exhaustive-deps */
import { FormProps } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { FC, ReactNode, useEffect } from 'react';
import { combineLatest, map, Observable, of } from 'rxjs';

import { Form, FormInstance } from '../../../ergodex-cdk';
import { useObservableAction } from '../../../hooks/useObservable';
import { isOnline$ } from '../../../services/new/networkConnection';
import { ergoBalance$, isWalletConnected$ } from '../../../services/new/wallet';
import { ActionButton, ActionButtonState } from './ActionButton/ActionButton';

export interface ActionFormStrategy<T = any> {
  isTokensNotSelected: (form: FormInstance<T>) => boolean;
  isAmountNotEntered: (form: FormInstance<T>) => boolean;
  isLiquidityInsufficient: (form: FormInstance<T>) => boolean;
  getInsufficientTokenForTx: (form: FormInstance<T>) => undefined | string;
  getInsufficientTokenForFee: (form: FormInstance<T>) => undefined | string;
  request: (form: FormInstance<T>) => Promise<any>;
  actionButtonCaption: () => ReactNode;
}

export interface ActionFormProps {
  readonly form: FormInstance;
  readonly strategy: ActionFormStrategy;
  readonly children?: ReactNode | ReactNode[];
  readonly initialValues?: any;
  readonly onFieldsChange?: FormProps['onFieldsChange'];
  readonly onValuesChange?: FormProps['onValuesChange'];
}

const getButtonData = (
  strategy: ActionFormStrategy,
  form: FormInstance,
): Observable<{
  state: ActionButtonState;
  data?: any;
}> => {
  return combineLatest([
    isOnline$,
    ergoBalance$,
    isWalletConnected$,
    of(strategy),
    of(form),
  ]).pipe(
    map(([isOnline, ergoBalance, isWalletConnected, strategy, form]) => {
      if (!isOnline) {
        return { state: ActionButtonState.CHECK_INTERNET_CONNECTION };
      } else if (strategy.isTokensNotSelected(form)) {
        return { state: ActionButtonState.SELECT_TOKEN };
      } else if (strategy.isAmountNotEntered(form)) {
        return { state: ActionButtonState.ENTER_AMOUNT };
      } else if (strategy.getInsufficientTokenForTx(form)) {
        return {
          state: ActionButtonState.INSUFFICIENT_TOKEN_BALANCE,
          data: { token: strategy.getInsufficientTokenForTx(form) },
        };
      } else if (strategy.getInsufficientTokenForFee(form)) {
        return {
          state: ActionButtonState.INSUFFICIENT_TOKEN_BALANCE,
          data: { token: strategy.getInsufficientTokenForFee(form) },
        };
      } else if (strategy.isLiquidityInsufficient(form)) {
        return { state: ActionButtonState.INSUFFICIENT_LIQUIDITY };
      } else {
        return { state: ActionButtonState.ACTION };
      }
    }),
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
  const [buttonData, updateButtonData] = useObservableAction(getButtonData, {
    state: ActionButtonState.CHECK_INTERNET_CONNECTION,
  });
  useEffect(() => {
    updateButtonData(strategy, form);
  }, [strategy, form]);

  const onFormChange = (changedValues: any, values: any) => {
    updateButtonData(strategy, form);
    if (onValuesChange) {
      onValuesChange(changedValues, values);
    }
  };
  const handleFieldsChange = (changes: FieldData[], values: any) => {
    if (onFieldsChange) {
      onFieldsChange(changes, values);
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
        state={buttonData.state}
        token={buttonData.data?.token}
        nativeToken={buttonData.data?.nativeToken}
      >
        {strategy.actionButtonCaption()}
      </ActionButton>
    </Form>
  );
};
