import './OperationForm.less';

import { Button, Flex, Form, FormGroup } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { ReactNode, useEffect, useState } from 'react';
import { debounceTime, first, Observable } from 'rxjs';

// import { PAnalytics } from '../../common/analytics/@types/types';
import { useObservable } from '../../common/hooks/useObservable';
import { Balance } from '../../common/models/Balance';
import { isOnline$ } from '../../common/streams/networkConnection';
import { useAssetsBalance } from '../../gateway/api/assetBalance';
import { queuedOperation$ } from '../../gateway/api/queuedOperation';
import { ConnectWalletButton } from '../common/ConnectWalletButton/ConnectWalletButton';

export type OperationLoader<T> = (form: FormGroup<T>) => boolean;

export type OperationValidator<T> = (
  form: FormGroup<T>,
  balance: Balance,
) => ReactNode | ReactNode[] | string | undefined;

export interface OperationFormProps<T> {
  readonly analytics?: any;
  readonly validators?: OperationValidator<T>[];
  readonly loaders?: OperationLoader<T>[];
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
  loaders,
  form,
  onSubmit,
  children,
  actionCaption,
  analytics,
}: OperationFormProps<T>): JSX.Element {
  const [isOnline] = useObservable(isOnline$);
  const [queuedOperation] = useObservable(queuedOperation$);
  const [balance, isBalanceLoading] = useAssetsBalance();
  const [value] = useObservable(
    form.valueChangesWithSilent$.pipe(debounceTime(100)),
    [form],
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
    } else if (isBalanceLoading || loaders?.some((l) => l(form))) {
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
      const caption = validators?.reduce<ReactNode | undefined>(
        (caption, v) => {
          if (caption) {
            return caption;
          }
          return v(form, balance);
        },
        undefined,
      );

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
    loaders,
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
  // console.log(validators);
  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Flex col>
        {children}
        <Flex.Item marginTop={4}>
          <ConnectWalletButton
            className="connect-wallet-button"
            size="extra-large"
            analytics={analytics}
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
