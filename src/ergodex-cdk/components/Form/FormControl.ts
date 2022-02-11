import { BehaviorSubject, Observable } from 'rxjs';

import { AbstractFormItem, CheckFn, EventConfig, FormItemState } from './core';

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
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  currentWarning: string | undefined = this.valid
    ? this.getCurrentCheckName(this.value, this.warningValidators)
    : undefined;

  withWarnings = !!this.currentWarning;

  withoutWarnings = !this.withWarnings;

  touched = false;

  untouched = true;

  get state(): FormItemState {
    if (this.invalid) {
      return 'error';
    }
    if (this.withWarnings) {
      return 'warning';
    }
    return undefined;
  }

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

  internalPatchValue(value: T, config?: EventConfig): void {
    this.value = value;
    this.currentError = this.getCurrentCheckName(
      this.value,
      this.errorValidators,
    );
    this.invalid = !!this.currentError;
    this.valid = !this.invalid;
    this.currentWarning = this.valid
      ? this.getCurrentCheckName(this.value, this.warningValidators)
      : undefined;
    this.withWarnings = !!this.currentWarning;
    this.withoutWarnings = !this.withWarnings;
    this.emitEvent(config);
  }

  patchValue(value: T, config?: EventConfig): void {
    this.internalPatchValue(value, config);
    this.parent.emitEvent(config);
  }

  onChange(value: T, config?: EventConfig): void {
    this.patchValue(value, config);
  }

  reset(value: T, config?: EventConfig): void {
    this.patchValue(value, config);
    this.markAsUntouched();
  }

  emitEvent(config?: EventConfig): void {
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
