/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { first, Observable } from 'rxjs';

import { Flex } from '../../../ergodex-cdk';
import { Form, FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { useObservable } from '../../../hooks/useObservable';
import { isWalletLoading$ } from '../../../services/new/core';
import { isOnline$ } from '../../../services/new/networkConnection';
import { ActionButton, ActionButtonState } from './ActionButton/ActionButton';

export interface ActionFormProps<T> {
  readonly form: FormGroup<T>;
  readonly children?: ReactNode | ReactNode[];
  readonly isTokensNotSelected?: (form: T) => boolean;
  readonly isAmountNotEntered?: (form: T) => boolean;
  readonly isLiquidityInsufficient?: (form: T) => boolean;
  readonly getInsufficientTokenNameForTx?: (form: T) => undefined | string;
  readonly getInsufficientTokenNameForFee?: (form: T) => undefined | string;
  readonly action?: (form: T) => Promise<any> | Observable<any> | void;
  readonly actionButton?: ReactNode | string;
}

export const ActionForm: FC<ActionFormProps<any>> = ({
  form,
  isLiquidityInsufficient,
  action,
  actionButton,
  isAmountNotEntered,
  isTokensNotSelected,
  getInsufficientTokenNameForFee,
  getInsufficientTokenNameForTx,
  children,
}) => {
  const [isOnline] = useObservable(isOnline$);
  const [isWalletLoading] = useObservable(isWalletLoading$);
  const [value] = useObservable(form.valueChangesWithSilent$, {
    deps: [form],
  });
  const [buttonData, setButtonData] = useState<{
    state: ActionButtonState;
    data?: any;
  }>({
    state: ActionButtonState.CHECK_INTERNET_CONNECTION,
  });

  useEffect(() => {
    if (!isOnline) {
      setButtonData({ state: ActionButtonState.CHECK_INTERNET_CONNECTION });
    } else if (isWalletLoading) {
      setButtonData({ state: ActionButtonState.LOADING });
    } else if (isTokensNotSelected && isTokensNotSelected(value)) {
      setButtonData({ state: ActionButtonState.SELECT_TOKEN });
    } else if (isAmountNotEntered && isAmountNotEntered(value)) {
      setButtonData({ state: ActionButtonState.ENTER_AMOUNT });
    } else if (
      getInsufficientTokenNameForTx &&
      getInsufficientTokenNameForTx(value)
    ) {
      setButtonData({
        state: ActionButtonState.INSUFFICIENT_TOKEN_BALANCE,
        data: {
          token: getInsufficientTokenNameForTx(value),
        },
      });
    } else if (
      getInsufficientTokenNameForFee &&
      getInsufficientTokenNameForFee(value)
    ) {
      setButtonData({
        state: ActionButtonState.INSUFFICIENT_FEE_BALANCE,
        data: {
          token: getInsufficientTokenNameForFee(value),
        },
      });
    } else if (isLiquidityInsufficient && isLiquidityInsufficient(value)) {
      setButtonData({ state: ActionButtonState.INSUFFICIENT_LIQUIDITY });
    } else {
      setButtonData({ state: ActionButtonState.ACTION });
    }
  }, [isOnline, isWalletLoading, value]);

  const handleSubmit = () => {
    if (buttonData.state !== ActionButtonState.ACTION || !action) {
      return;
    }

    const result = action(value);

    if (result instanceof Observable) {
      result.pipe(first()).subscribe();
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Flex col>
        {children}
        <Flex.Item marginTop={4}>
          <ActionButton
            onClick={handleSubmit}
            state={buttonData.state}
            token={buttonData.data?.token}
            nativeToken={buttonData.data?.nativeToken}
          >
            {actionButton}
          </ActionButton>
        </Flex.Item>
      </Flex>
    </Form>
  );
};
