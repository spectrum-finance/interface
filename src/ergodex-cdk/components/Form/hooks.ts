import { useState } from 'react';

import { CheckFn } from './core';
import { FormGroup, FormGroupParams } from './FormGroup';

function _useForm<T>(param: FormGroupParams<T>): FormGroup<T> {
  const [form] = useState(new FormGroup<T>(param));

  return form;
}

function ctrl<T>(
  value: T,
  errorValidators?: CheckFn<T>[],
  warningValidators?: CheckFn<T>[],
): {
  value: T;
  errorValidators: CheckFn[];
  warningValidators: CheckFn[];
  __config: true;
} {
  return {
    value,
    errorValidators: errorValidators || [],
    warningValidators: warningValidators || [],
    __config: true,
  };
}

(_useForm as any).ctrl = ctrl;

export const useForm: typeof _useForm & { ctrl: typeof ctrl } = _useForm as any;
