import { BehaviorSubject, Observable } from 'rxjs';

import { AbstractFormItem, EventConfig } from './core';
import { FormControl, FormControlParams } from './FormControl';

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

  get withWarnings(): boolean {
    return this.controlsArray.some((c) => c.withWarnings);
  }

  get withoutWarnings(): boolean {
    return this.controlsArray.every((c) => c.withoutWarnings);
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

  markAllAsTouched(): void {
    this.controlsArray.forEach((c) => c.markAsTouched());
  }

  markAllAsUntouched(): void {
    this.controlsArray.forEach((c) => c.markAsUntouched());
  }

  patchValue(value: Partial<T>, config?: EventConfig): void {
    Object.entries(value).forEach(([key, value]) =>
      this.controls[key as keyof T].internalPatchValue(value as any, config),
    );
    this.emitEvent(config);
  }

  reset(value: Partial<T>, config?: EventConfig): void {
    Object.entries(value).forEach(([key, value]) =>
      this.controls[key as keyof T].reset(value as any, config),
    );
    this.emitEvent(config);
  }

  private emitEvent(config?: EventConfig): void {
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
