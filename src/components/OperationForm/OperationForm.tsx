import './OperationForm.less';

import { Button, Flex, Form, FormGroup } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { ElementName, TraceProps } from '@spectrumlabs/analytics';
import { ReactNode, useEffect, useState } from 'react';
import {
  debounceTime,
  first,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { Balance } from '../../common/models/Balance';
import { isOnline$ } from '../../common/streams/networkConnection';
import { useAssetsBalance } from '../../gateway/api/assetBalance';
import { queuedOperation$ } from '../../gateway/api/queuedOperation';
import { ConnectWalletButton } from '../common/ConnectWalletButton/ConnectWalletButton';

export type OperationLoader<T> = (form: FormGroup<T>) => boolean;

export type OperationValidatorContent =
  | ReactNode
  | ReactNode[]
  | string
  | Observable<
      | ReactNode
      | ReactNode[]
      | string
      | undefined
      | { content: OperationValidatorContent; action: () => void }
    >;

export type OperationValidator<T> = (
  form: FormGroup<T>,
  balance: Balance,
) =>
  | OperationValidatorContent
  | string
  | undefined
  | { content: OperationValidatorContent; action: () => void };

export interface OperationFormProps<T> {
  readonly validators?: OperationValidator<T>[];
  readonly loaders?: OperationLoader<T>[];
  readonly form: FormGroup<T>;
  readonly actionCaption: ReactNode | ReactNode[] | string;
  readonly onSubmit: (
    form: FormGroup<T>,
  ) => Observable<any> | void | Promise<any>;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly traceFormLocation: TraceProps['element_location'];
}

function callValidatorSafely<V, D = undefined>(
  validator: OperationValidator<V>,
  defaultValue: D,
  ...args: Parameters<OperationValidator<V>>
): ReturnType<OperationValidator<V>> | D {
  try {
    return validator(...args);
  } catch (err) {
    console.warn(err);
    return defaultValue;
  }
}

export function OperationForm<T>({
  validators,
  loaders,
  form,
  onSubmit,
  children,
  actionCaption,
  traceFormLocation,
}: OperationFormProps<T>): JSX.Element {
  const CHECK_INTERNET_CONNECTION_CAPTION = t`Check Internet Connection`;
  const LOADING_WALLET_CAPTION = t`Loading`;
  const PROCESSING_TRANSACTION_CAPTION = t`Processing transaction`;

  const [validatorSubscription, setValidatorSubscription] = useState<
    Subscription | undefined
  >(undefined);
  const [isOnline] = useObservable(isOnline$);
  const [queuedOperation] = useObservable(queuedOperation$);
  const [balance, isBalanceLoading] = useAssetsBalance();
  const [value] = useObservable(
    form.valueChangesWithSilent$.pipe(debounceTime(100)),
    [form],
    // @ts-ignore
    {},
  );
  const [{ loading, disabled, caption, action }, setButtonProps] = useState<{
    loading: boolean;
    disabled: boolean;
    caption: ReactNode | ReactNode[] | string;
    action?: () => void;
  }>({
    loading: true,
    disabled: false,
    caption: LOADING_WALLET_CAPTION,
  });

  useEffect(() => {
    if (validatorSubscription) {
      validatorSubscription.unsubscribe();
      setButtonProps({
        disabled: false,
        loading: true,
        caption: LOADING_WALLET_CAPTION,
      });
    }

    const timerId = setTimeout(() => {
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
        const results =
          validators?.map((v) =>
            callValidatorSafely<T, undefined>(v, undefined, form, balance),
          ) || [];
        const firstResultIndex = results.findIndex(Boolean);
        const firstResult =
          firstResultIndex !== -1 ? results[firstResultIndex] : undefined;

        if (firstResult instanceof Observable) {
          setButtonProps({
            disabled: false,
            loading: true,
            caption: LOADING_WALLET_CAPTION,
          });
          const subscription = of(undefined)
            .pipe(
              //@ts-ignore
              ...results.slice(firstResultIndex).map((result) =>
                switchMap((prev) => {
                  if (prev) {
                    return of(prev);
                  }
                  return result instanceof Observable ? result : of(result);
                }),
              ),
            )
            .subscribe((result) => {
              if (!result) {
                setButtonProps({
                  disabled: false,
                  loading: false,
                  caption: actionCaption,
                });
              } else if ((result as any).content) {
                setButtonProps({
                  disabled: false,
                  loading: false,
                  caption: (result as any).content,
                  action: (result as any).action,
                });
              } else {
                setButtonProps({
                  disabled: true,
                  loading: false,
                  caption: result,
                });
              }
            });
          setValidatorSubscription(subscription);
        } else if (!!firstResult) {
          if ((firstResult as any).content) {
            setButtonProps({
              disabled: false,
              loading: false,
              caption: (firstResult as any).content,
              action: (firstResult as any).action,
            });
          } else {
            setButtonProps({
              disabled: true,
              loading: false,
              caption: firstResult,
            });
          }
        } else {
          setButtonProps({
            disabled: false,
            loading: false,
            caption: actionCaption,
          });
        }
      }
    }, 200);

    return () => clearTimeout(timerId);
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
    if (action) {
      action();
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
            trace={{
              element_name: ElementName.connectWalletButton,
              element_location: traceFormLocation,
            }}
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
