import './OperationForm.less';

import { Button, Flex, Form, FormGroup } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { ReactNode, useEffect, useState } from 'react';
import { debounceTime, first, Observable } from 'rxjs';

// import { PAnalytics } from '../../common/analytics/src/types';
import { useObservable } from '../../common/hooks/useObservable';
import { isOnline$ } from '../../common/streams/networkConnection';
import { useAssetsBalance } from '../../gateway/api/assetBalance';
import { queuedOperation$ } from '../../gateway/api/queuedOperation';
import { ConnectWalletButton } from '../common/ConnectWalletButton/ConnectWalletButton';

export type OperationValidator<T> = (
  form: FormGroup<T>,
) => ReactNode | ReactNode[] | string | undefined;

export interface OperationFormProps<T> {
  readonly validators?: OperationValidator<T>[];
  readonly form: FormGroup<T>;
  readonly actionCaption: ReactNode | ReactNode[] | string;
  readonly onSubmit: (
    form: FormGroup<T>,
  ) => Observable<any> | void | Promise<any>;
  readonly children?: ReactNode | ReactNode[] | string;
}

const CHECK_INTERNET_CONNECTION_CAPTION = t`Check Internet Connection`;
const LOADING_WALLET_CAPTION = t`Loading`;
const PROCESSING_TRANSACTION_CAPTION = t`Processing transaction`;

export function OperationForm<T>({
  validators,
  form,
  onSubmit,
  children,
  actionCaption,
}: OperationFormProps<T>): JSX.Element {
  const [isOnline] = useObservable(isOnline$);
  const [queuedOperation] = useObservable(queuedOperation$);
  const [, isBalanceLoading] = useAssetsBalance();
  const [value] = useObservable(
    form.valueChangesWithSilent$.pipe(debounceTime(100)),
    [form],
    // TODO: Teach debt
    // @ts-ignore
    {},
  );
  const [{ loading, disabled, caption }, setButtonProps] = useState<{
    loading: boolean;
    disabled: boolean;
    caption: ReactNode | ReactNode[] | string;
  }>({
    loading: false,
    disabled: true,
    caption: CHECK_INTERNET_CONNECTION_CAPTION,
  });

  useEffect(() => {
    if (!isOnline) {
      setButtonProps({
        disabled: true,
        loading: false,
        caption: CHECK_INTERNET_CONNECTION_CAPTION,
      });
    } else if (isBalanceLoading) {
      setButtonProps({
        disabled: false,
        loading: true,
        caption: LOADING_WALLET_CAPTION,
      });
    } else if (!!queuedOperation) {
      setButtonProps({
        disabled: false,
        loading: true,
        caption: PROCESSING_TRANSACTION_CAPTION,
      });
    } else {
      const caption = validators?.map((v) => v(form)).find(Boolean);

      setButtonProps({
        disabled: !!caption,
        loading: false,
        caption: caption || actionCaption,
      });
    }
  }, [
    isOnline,
    isBalanceLoading,
    value,
    validators,
    actionCaption,
    queuedOperation,
  ]);

  const handleSubmit = () => {
    if (loading || disabled) {
      return;
    }
    const result = onSubmit(form);

    if (result instanceof Observable) {
      result.pipe(first()).subscribe();
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Flex col>
        {children}
        <Flex.Item marginTop={4}>
          <ConnectWalletButton
            className="connect-wallet-button"
            size="extra-large"
          >
            <Button
              loading={loading}
              disabled={disabled}
              type="primary"
              size="extra-large"
              className="operation-form-submit-button"
              htmlType="submit"
            >
              {caption}
            </Button>
          </ConnectWalletButton>
        </Flex.Item>
      </Flex>
    </Form>
  );
}
