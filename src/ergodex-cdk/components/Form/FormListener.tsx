import React, { ReactNode } from 'react';
import { Subscription } from 'rxjs';

import { FormItemState } from './core';
import { FormContext } from './FormContext';

interface FormListenerFnParams<T> {
  readonly value: T;
  readonly touched: boolean;
  readonly untouched: boolean;
  readonly invalid: boolean;
  readonly valid: boolean;
  readonly state: FormItemState;
  readonly withWarnings?: boolean;
  readonly withoutWarnings?: boolean;
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
        {({ form }) => {
          const item = name ? form.controls[name] : form;
          if (!this.subscription && item) {
            this.subscription = item.valueChangesWithSilent$.subscribe(() =>
              this.forceUpdate(),
            );
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
              })
            : undefined;
        }}
      </FormContext.Consumer>
    );
  }
}
