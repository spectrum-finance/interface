import { Form, FormInstance } from 'antd';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { useWallet } from '../../../context';
import { useConnection } from '../../../context/ConnectionContext';
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
}

export const ActionForm: FC<ActionFormProps> = ({
  form,
  strategy,
  children,
  initialValues,
}) => {
  const { isWalletConnected, ergBalance } = useWallet();
  const { online } = useConnection();
  const [buttonData, setButtonData] = useState<{
    state: ActionButtonState;
    data?: any;
  }>({
    state: ActionButtonState.ACTION,
    data: undefined,
  });
  const [formValueChanged, setFormValueChanged] = useState({});

  useEffect(() => {
    if (!isWalletConnected || !ergBalance) {
      setButtonData({ state: ActionButtonState.CONNECT_WALLET });
    } else if (!online) {
      setButtonData({ state: ActionButtonState.CHECK_INTERNET_CONNECTION });
    } else if (strategy.isTokensNotSelected(form)) {
      setButtonData({ state: ActionButtonState.SELECT_TOKEN });
    } else if (strategy.isAmountNotEntered(form)) {
      setButtonData({ state: ActionButtonState.ENTER_AMOUNT });
    } else if (strategy.getInsufficientTokenForTx(form)) {
      setButtonData({
        state: ActionButtonState.INSUFFICIENT_TOKEN_BALANCE,
        data: { token: strategy.getInsufficientTokenForTx(form) },
      });
    } else if (strategy.getInsufficientTokenForFee(form)) {
      setButtonData({
        state: ActionButtonState.INSUFFICIENT_TOKEN_BALANCE,
        data: { token: strategy.getInsufficientTokenForFee(form) },
      });
    } else if (strategy.isLiquidityInsufficient(form)) {
      setButtonData({ state: ActionButtonState.INSUFFICIENT_LIQUIDITY });
    } else {
      setButtonData({ state: ActionButtonState.ACTION });
    }
  }, [online, ergBalance, isWalletConnected, strategy, form, formValueChanged]);

  //TODO: REWRITE
  const onFormChange = () => setFormValueChanged({});

  return (
    <Form
      form={form}
      initialValues={initialValues}
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
