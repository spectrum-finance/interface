import React, { createContext, FormEvent, ReactNode, useState } from 'react';
import {
  BehaviorSubject,
  combineLatest,
  map,
  mapTo,
  merge,
  Observable,
  publishReplay,
  refCount,
  Subscription,
} from 'rxjs';

// eslint-disable-next-line @typescript-eslint/ban-types
export type CheckFn = () => {};

export function useForm<T>(param: T): FormGroup<T> {
  const [form] = useState(new FormGroup<T>(param));

  return form;
}

interface EventConfig {
  readonly emitEvent: 'default' | 'system' | 'silent';
}

interface AbstractFormItem<T> {
  readonly value: T;

  readonly invalid: boolean;

  readonly valid: boolean;

  readonly touched: boolean;

  readonly untouched: boolean;

  readonly valueChanges$: Observable<T>;

  readonly valueChangesWithSystem$: Observable<T>;
}

export type FormControlParams<T> =
  | T
  | { value: T; validators: CheckFn[]; warnings: CheckFn[] };

export class FormControl<T> implements AbstractFormItem<T> {
  constructor(
    public name: string,
    private param: FormControlParams<T>,
    private parent: any,
  ) {}

  invalid = false;

  valid = true;

  touched = false;

  untouched = true;

  //@ts-ignore
  value: T = this.getValueFromParam(this.param);

  get valueChanges$(): Observable<T> {
    return this._valueChanges$;
  }

  get valueChangesWithSystem$(): Observable<T> {
    return this._valueChangesWithSystem$;
  }

  get valueChangesWithSilent$(): Observable<T> {
    return this._valueChangesWithSilent$;
  }

  private readonly _valueChanges$ = new BehaviorSubject<T>(this.value);

  private readonly _valueChangesWithSystem$ = new BehaviorSubject<T>(
    this.value,
  );

  private readonly _valueChangesWithSilent$ = new BehaviorSubject<T>(
    this.value,
  );

  markAsTouched(): void {
    this.touched = true;
    this.untouched = false;
  }

  markAsUntouched(): void {
    this.untouched = true;
    this.touched = false;
  }

  patchValue(partialValue: T, config?: EventConfig): void {
    this.value = partialValue;
    this.emitEvent(config);
  }

  onChange(value: T): void {
    this.patchValue(value);
    this.parent.emitEvent();
  }

  reset(value: T, config?: EventConfig): void {
    this.value = value;
    this.emitEvent(config);
    this.markAsUntouched();
  }

  emitEvent(config?: EventConfig) {
    if (
      config?.emitEvent === 'system' ||
      config?.emitEvent === 'default' ||
      config?.emitEvent === 'silent' ||
      !config?.emitEvent
    ) {
      this._valueChangesWithSilent$.next(this.value);
    }
    if (
      config?.emitEvent === 'system' ||
      config?.emitEvent === 'default' ||
      !config?.emitEvent
    ) {
      this._valueChangesWithSystem$.next(this.value);
    }
    if (config?.emitEvent === 'default' || !config?.emitEvent) {
      this._valueChanges$.next(this.value);
    }
  }

  private getValueFromParam(param: FormControlParams<T>) {
    return param instanceof Object && param.value ? param.value : param;
  }
}

export type FormGroupParams<T> = {
  [key in keyof T]: FormControlParams<T[key]>;
};

export class FormGroup<T> implements AbstractFormItem<T> {
  //@ts-ignore
  private controlsArray = Object.entries(this.params).map(
    ([key, param]) => new FormControl(key, param, this),
  );

  //@ts-ignore
  controls = this.controlsArray.reduce<{
    [key in keyof Required<T>]: FormControl<T[key]>;
  }>(this.toControlDictionary, {} as any);

  get valueChanges$(): Observable<T> {
    return this._valueChanges$;
  }

  get valueChangesWithSystem$(): Observable<T> {
    return this._valueChangesWithSystem$;
  }

  get valueChangesWithSilent$(): Observable<T> {
    return this._valueChangesWithSilent$;
  }

  private readonly _valueChanges$ = new BehaviorSubject<T>(this.value);

  private readonly _valueChangesWithSystem$ = new BehaviorSubject<T>(
    this.value,
  );

  private readonly _valueChangesWithSilent$ = new BehaviorSubject<T>(
    this.value,
  );

  get invalid(): boolean {
    return this.controlsArray.some((c) => c.invalid);
  }

  get valid(): boolean {
    return this.controlsArray.every((c) => c.valid);
  }

  get touched(): boolean {
    return this.controlsArray.some((c) => c.touched);
  }

  get untouched(): boolean {
    return this.controlsArray.every((c) => c.untouched);
  }

  get value(): T {
    // @ts-ignore
    return this.controlsArray.reduce<T>((acc, ctrl) => {
      // @ts-ignore
      acc[ctrl.name] = ctrl.value;

      return acc;
    }, {} as any);
  }

  constructor(private params: FormGroupParams<T>) {}

  private toControlDictionary(
    dictionary: { [key in keyof Required<T>]: FormControl<T[key]> },
    ctrl: FormControl<unknown>,
  ): { [key in keyof Required<T>]: FormControl<T[key]> } {
    //@ts-ignore
    dictionary[ctrl.name] = ctrl;

    return dictionary;
  }

  markAllAsTouched() {
    this.controlsArray.forEach((c) => c.markAsTouched());
  }

  markAllAsUntouched() {
    this.controlsArray.forEach((c) => c.markAsUntouched());
  }

  patchValue(value: Partial<T>, config?: EventConfig) {
    Object.entries(value).forEach(([key, value]) =>
      this.controls[key as keyof T].patchValue(value as any, config),
    );
    this.emitEvent(config);
  }

  reset(value: Partial<T>, config?: EventConfig) {
    Object.entries(value).forEach(([key, value]) =>
      this.controls[key as keyof T].reset(value as any, config),
    );
    this.emitEvent(config);
  }

  private emitEvent(config?: EventConfig) {
    if (
      config?.emitEvent === 'system' ||
      config?.emitEvent === 'default' ||
      config?.emitEvent === 'silent' ||
      !config?.emitEvent
    ) {
      this._valueChangesWithSilent$.next(this.value);
    }
    if (
      config?.emitEvent === 'system' ||
      config?.emitEvent === 'default' ||
      !config?.emitEvent
    ) {
      this._valueChangesWithSystem$.next(this.value);
    }
    if (config?.emitEvent === 'default' || !config?.emitEvent) {
      this._valueChanges$.next(this.value);
    }
  }
}

export interface FormProps<T> {
  readonly form: FormGroup<T>;
  readonly onSubmit: (form: FormGroup<T>) => void;
  readonly children?: ReactNode | ReactNode[] | string;
}

export const FormContext = createContext<{ form: FormGroup<any> }>({} as any);

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
    const { children, form } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormContext.Provider value={{ form }}>{children}</FormContext.Provider>
      </form>
    );
  }
}

interface FormItemFnParams<T> {
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly touched: boolean;
  readonly untouched: boolean;
  readonly invalid: boolean;
  readonly valid: boolean;
}

export interface FormItemProps<T> {
  readonly name: string;
  readonly children?: (
    params: FormItemFnParams<T>,
  ) => ReactNode | ReactNode[] | string;
}

class _FormItem<T = any> extends React.Component<FormItemProps<T>> {
  //@ts-ignore
  private subscription: Subscription;

  componentWillUnmount() {
    this.subscription?.unsubscribe();
  }

  onChange(ctrl: FormControl<T>, value: T) {
    ctrl.onChange(value);
  }

  render() {
    const { name, children } = this.props;

    return (
      <FormContext.Consumer>
        {({ form }) => {
          const control = form.controls[name];
          if (!this.subscription && control) {
            this.subscription = control.valueChangesWithSilent$.subscribe(() =>
              this.forceUpdate(),
            );
          }

          return children && control
            ? children({
                onChange: this.onChange.bind(this, control),
                value: control.value,
                touched: control.touched,
                untouched: control.untouched,
                invalid: control.invalid,
                valid: control.valid,
              })
            : undefined;
        }}
      </FormContext.Consumer>
    );
  }
}

export const Form: typeof _Form & { Item: typeof _FormItem } = _Form as any;
Form.Item = _FormItem;
