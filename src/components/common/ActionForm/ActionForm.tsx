/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { debounceTime, first, Observable } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { isOnline$ } from '../../../common/streams/networkConnection';
import { Flex } from '../../../ergodex-cdk';
import { Form, FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { isWalletLoading$ } from '../../../services/new/core';
import { ActionButton, ActionButtonState } from './ActionButton/ActionButton';

export interface ActionFormProps<T> {
  readonly form: FormGroup<T>;
  readonly children?: ReactNode | ReactNode[];
  readonly isTokensNotSelected?: (form: T) => boolean;
  readonly isAmountNotEntered?: (form: T) => boolean;
  readonly isLoading?: (form: T) => boolean;
  readonly getMinValueForToken?: (form: T) => undefined | Currency;
  readonly isLiquidityInsufficient?: (form: T) => boolean;
  readonly isSwapLocked?: (form: T) => boolean;
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
  isSwapLocked,
  getInsufficientTokenNameForTx,
  getMinValueForToken,
  isLoading,
  children,
}) => {
  const [isOnline] = useObservable(isOnline$);
  const [isWalletLoading] = useObservable(isWalletLoading$);
  const [value] = useObservable(
    form.valueChangesWithSilent$.pipe(debounceTime(100)),
    [form],
    {},
  );
  const [buttonData, setButtonData] = useState<{
    state: ActionButtonState;
    data?: any;
  }>({
    state: ActionButtonState.CHECK_INTERNET_CONNECTION,
  });

  useEffect(() => {
    if (!isOnline) {
      setButtonData({ state: ActionButtonState.CHECK_INTERNET_CONNECTION });
    } else if (isWalletLoading || (isLoading && isLoading(value))) {
      setButtonData({ state: ActionButtonState.LOADING });
    } else if (isTokensNotSelected && isTokensNotSelected(value)) {
      setButtonData({ state: ActionButtonState.SELECT_TOKEN });
    } else if (isSwapLocked && isSwapLocked(value)) {
      setButtonData({ state: ActionButtonState.SWAP_LOCK });
    } else if (isAmountNotEntered && isAmountNotEntered(value)) {
      setButtonData({ state: ActionButtonState.ENTER_AMOUNT });
    } else if (getMinValueForToken && getMinValueForToken(value)) {
      setButtonData({
        state: ActionButtonState.MIN_VALUE,
        data: {
          currency: getMinValueForToken(value),
        },
      });
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
          nativeToken: getInsufficientTokenNameForFee(value),
        },
      });
    } else if (isLiquidityInsufficient && isLiquidityInsufficient(value)) {
      setButtonData({ state: ActionButtonState.INSUFFICIENT_LIQUIDITY });
    } else {
      setButtonData({ state: ActionButtonState.ACTION });
    }
  }, [
    isOnline,
    isWalletLoading,
    value,
    isLiquidityInsufficient,
    getInsufficientTokenNameForFee,
    getInsufficientTokenNameForTx,
  ]);

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
            currency={buttonData.data?.currency}
          >
            {actionButton}
          </ActionButton>
        </Flex.Item>
      </Flex>
    </Form>
  );
};
