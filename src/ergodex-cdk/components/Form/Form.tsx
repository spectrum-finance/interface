import React, { FormEvent, ReactNode } from 'react';

import { Messages } from './core';
import { FormContext } from './FormContext';
import { FormGroup } from './FormGroup';
import { FormItem } from './FormItem';
import { FormListener } from './FormListener';

export interface FormProps<T> {
  readonly form: FormGroup<T>;
  readonly onSubmit: (form: FormGroup<T>) => void;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly errorMessages?: Messages<T>;
  readonly warningMessages?: Messages<T>;
}

class _Form<T> extends React.Component<FormProps<T>> {
  constructor(props: FormProps<T>) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onSubmit(this.props.form);
  }

  render() {
    const { children, form, errorMessages, warningMessages } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormContext.Provider value={{ errorMessages, warningMessages, form }}>
          {children}
        </FormContext.Provider>
      </form>
    );
  }
}

export const Form: typeof _Form & {
  Item: typeof FormItem;
  Listener: typeof FormListener;
} = _Form as any;
Form.Item = FormItem;
Form.Listener = FormListener;
