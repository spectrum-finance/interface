import { Observable } from 'rxjs';

export type CheckFn<T = any> = (t: T) => string | undefined;

export interface EventConfig {
  readonly emitEvent: 'default' | 'system' | 'silent';
}

export type Messages<T> = {
  [key in keyof Partial<T>]: {
    [key: string]: string | ((value: T[key]) => string);
  };
};

export type FormItemState = 'error' | 'warning' | undefined;

export interface AbstractFormItem<T> {
  readonly value: T;

  readonly invalid: boolean;

  readonly valid: boolean;

  readonly withWarnings: boolean;

  readonly withoutWarnings: boolean;

  readonly state: FormItemState;

  readonly touched: boolean;

  readonly untouched: boolean;

  readonly valueChanges$: Observable<T>;

  readonly valueChangesWithSystem$: Observable<T>;
}
