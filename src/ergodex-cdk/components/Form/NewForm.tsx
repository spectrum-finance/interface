import React, {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export type CheckFn<T = any> = (t: T) => string | undefined;

export function _useForm<T>(param: FormGroupParams<T>): FormGroup<T> {
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

interface EventConfig {
  readonly emitEvent: 'default' | 'system' | 'silent';
}

export type Messages<T> = {
  [key in keyof Partial<T>]: {
    [key: string]: string | ((value: T[key]) => string);
  };
};

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
  | {
      value: T;
      errorValidators: CheckFn[];
      warningValidators: CheckFn[];
      __config: true;
    };

export class FormControl<T> implements AbstractFormItem<T> {
  constructor(
    public name: string,
    private param: FormControlParams<T>,
    private parent: any,
  ) {}

  //@ts-ignore
  value: T = this.getValueFromParam(this.param);

  //@ts-ignore
  errorValidators: CheckFn[] = this.getErrorValidatorsFromParam(this.param);

  //@ts-ignore
  warningValidators: CheckFn[] = this.getWarningValidatorsFromParam(this.param);

  currentError: string | undefined = this.getCurrentCheckName(
    this.value,
    this.errorValidators,
  );

  invalid = !!this.currentError;

  valid = !this.invalid;

  currentWarning: string | undefined = this.getCurrentCheckName(
    this.value,
    this.warningValidators,
  );

  withWarnings = !!this.currentWarning;

  withoutWarnings = !this.withWarnings;

  touched = false;

  untouched = true;

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

  patchValue(value: T, config?: EventConfig): void {
    this.value = value;
    this.currentError = this.getCurrentCheckName(
      this.value,
      this.errorValidators,
    );
    this.invalid = !!this.currentError;
    this.valid = !this.invalid;
    this.currentWarning = this.getCurrentCheckName(
      this.value,
      this.warningValidators,
    );
    this.withWarnings = !!this.currentWarning;
    this.withoutWarnings = !this.withWarnings;
    this.emitEvent(config);
  }

  onChange(value: T): void {
    this.patchValue(value);
    this.parent.emitEvent();
  }

  reset(value: T, config?: EventConfig): void {
    this.patchValue(value, config);
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

  private getCurrentCheckName(
    value: T,
    checkFns: CheckFn<T>[],
  ): string | undefined {
    for (let i = 0; i < checkFns.length; i++) {
      const result = checkFns[i](value);

      if (result) {
        return result;
      }
    }

    return undefined;
  }

  private getValueFromParam(param: FormControlParams<T>) {
    return param instanceof Object && param.__config ? param.value : param;
  }

  private getErrorValidatorsFromParam(param: FormControlParams<T>): CheckFn[] {
    return param instanceof Object && param.__config
      ? param.errorValidators || []
      : [];
  }

  private getWarningValidatorsFromParam(
    param: FormControlParams<T>,
  ): CheckFn[] {
    return param instanceof Object && param.__config
      ? param.warningValidators || []
      : [];
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
  readonly errorMessages?: Messages<T>;
  readonly warningMessages?: Messages<T>;
}

export const FormContext = createContext<{
  form: FormGroup<any>;
  errorMessages?: Messages<any>;
  warningMessages?: Messages<any>;
}>({} as any);

export const useFormContext = () => useContext(FormContext);

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

interface FormItemFnParams<T> {
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly touched: boolean;
  readonly untouched: boolean;
  readonly invalid: boolean;
  readonly valid: boolean;
  readonly warningMessage?: string;
  readonly withWarnings?: boolean;
  readonly withoutWarnings?: boolean;
  readonly errorMessage?: string;
}

export type Control<T> = Omit<Partial<FormItemFnParams<T>>, 'children'>;

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
        {({ form, errorMessages, warningMessages }) => {
          const control = form.controls[name];
          if (!this.subscription && control) {
            this.subscription = control.valueChangesWithSilent$.subscribe(() =>
              this.forceUpdate(),
            );
          }

          let warningMessage =
            control.currentWarning &&
            warningMessages &&
            warningMessages[name] &&
            warningMessages[name][control.currentWarning];

          if (warningMessage instanceof Function) {
            warningMessage = warningMessage(control.value);
          }

          let errorMessage =
            control.currentError &&
            errorMessages &&
            errorMessages[name] &&
            errorMessages[name][control.currentError];

          if (errorMessage instanceof Function) {
            errorMessage = errorMessage(control.value);
          }
          return children && control
            ? children({
                onChange: this.onChange.bind(this, control),
                value: control.value,
                touched: control.touched,
                untouched: control.untouched,
                invalid: control.invalid,
                valid: control.valid,
                withWarnings: control.withWarnings,
                withoutWarnings: control.withoutWarnings,
                errorMessage,
                warningMessage,
              })
            : undefined;
        }}
      </FormContext.Consumer>
    );
  }
}

export const Form: typeof _Form & { Item: typeof _FormItem } = _Form as any;
Form.Item = _FormItem;

export const useForm: typeof _useForm & { ctrl: typeof ctrl } = _useForm as any;
