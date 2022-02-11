import React, { ReactNode } from 'react';
import { Subscription } from 'rxjs';

import { FormContext } from './FormContext';

interface FormListenerFnParams<T> {
  readonly value: T;
  readonly touched: boolean;
  readonly untouched: boolean;
  readonly invalid: boolean;
  readonly valid: boolean;
  readonly withWarnings?: boolean;
  readonly withoutWarnings?: boolean;
}

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
                withWarnings: item.withWarnings,
                withoutWarnings: item.withoutWarnings,
              })
            : undefined;
        }}
      </FormContext.Consumer>
    );
  }
}
