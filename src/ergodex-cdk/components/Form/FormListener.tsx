import React, { ReactNode } from 'react';
import { Subscription } from 'rxjs';

import { FormItemState } from './core';
import { FormContext } from './FormContext';
import { FormGroup } from './FormGroup';

interface FormListenerFnParams<T> {
  readonly value: T;
  readonly touched: boolean;
  readonly untouched: boolean;
  readonly invalid: boolean;
  readonly valid: boolean;
  readonly state: FormItemState;
  readonly withWarnings?: boolean;
  readonly withoutWarnings?: boolean;
  readonly message?: string;
}

export type Listener<T> = Omit<Partial<FormListenerFnParams<T>>, 'children'>;

export interface FormListenerProps<T> {
  readonly name?: string;
  readonly children?: (
    params: FormListenerFnParams<T>,
  ) => ReactNode | ReactNode[] | string;
}

export class FormListener<T = any> extends React.Component<
  FormListenerProps<T>
> {
  //@ts-ignore
  private subscription: Subscription;

  componentWillUnmount(): void {
    this.subscription?.unsubscribe();
  }

  render(): ReactNode {
    const { name, children } = this.props;

    return (
      <FormContext.Consumer>
        {({ form, errorMessages, warningMessages }) => {
          const item = name ? form.controls[name] : form;
          if (!this.subscription && item) {
            this.subscription = item.valueChangesWithSilent$.subscribe(() =>
              this.forceUpdate(),
            );
          }

          let message = undefined;

          if (item instanceof FormGroup) {
            message = undefined;
          } else if (item.invalid && name) {
            message =
              item.currentError &&
              errorMessages &&
              errorMessages[name] &&
              errorMessages[name][item.currentError];
          } else if (item.withWarnings && name) {
            message =
              item.currentWarning &&
              warningMessages &&
              warningMessages[name] &&
              warningMessages[name][item.currentWarning];
          }

          if (message instanceof Function) {
            message = message(item.value);
          }

          return children && item
            ? children({
                value: item.value,
                touched: item.touched,
                untouched: item.untouched,
                invalid: item.invalid,
                valid: item.valid,
                state: item.state,
                withWarnings: item.withWarnings,
                withoutWarnings: item.withoutWarnings,
                message,
              })
            : undefined;
        }}
      </FormContext.Consumer>
    );
  }
}
