import React, { ReactNode } from 'react';
import { Subscription } from 'rxjs';

import { EventConfig, FormItemState } from './core';
import { FormContext } from './FormContext';
import { FormControl } from './FormControl';

interface FormItemFnParams<T> {
  readonly value: T;
  readonly onChange: (value: T, config?: EventConfig) => void;
  readonly touched: boolean;
  readonly untouched: boolean;
  readonly invalid: boolean;
  readonly valid: boolean;
  readonly state: FormItemState;
  readonly withWarnings?: boolean;
  readonly withoutWarnings?: boolean;
  readonly message?: string;
}

export type Control<T> = Omit<Partial<FormItemFnParams<T>>, 'children'>;

export interface FormItemProps<T> {
  readonly name: string;
  readonly children?: (
    params: FormItemFnParams<T>,
  ) => ReactNode | ReactNode[] | string;
}

export class FormItem<T = any> extends React.Component<FormItemProps<T>> {
  //@ts-ignore
  private subscription: Subscription;

  componentWillUnmount(): void {
    this.subscription?.unsubscribe();
  }

  onChange(ctrl: FormControl<T>, value: T, config?: EventConfig): void {
    ctrl.onChange(value, config);
  }

  render(): ReactNode {
    const { name, children } = this.props;

    return (
      <FormContext.Consumer>
        {({ form, errorMessages, warningMessages }) => {
          const control = form.controls[name];
          if (!this.subscription && control) {
            this.subscription = control.valueChangesWithSilent$.subscribe(() =>
              this.forceUpdate(),
            );
          }

          let message = undefined;

          if (control.invalid) {
            message =
              control.currentError &&
              errorMessages &&
              errorMessages[name] &&
              errorMessages[name][control.currentError];
          } else if (control.withWarnings) {
            message =
              control.currentWarning &&
              warningMessages &&
              warningMessages[name] &&
              warningMessages[name][control.currentWarning];
          }

          if (message instanceof Function) {
            message = message(control.value);
          }
          return children && control
            ? children({
                onChange: this.onChange.bind(this, control),
                value: control.value,
                touched: control.touched,
                untouched: control.untouched,
                state: control.state,
                invalid: control.invalid,
                valid: control.valid,
                withWarnings: control.withWarnings,
                withoutWarnings: control.withoutWarnings,
                message,
              })
            : undefined;
        }}
      </FormContext.Consumer>
    );
  }
}
