/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import {
  catchError,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';

import { Unpacked } from '../utils/unpacked';

export function useObservable<T>(
  observable: Observable<T> | (() => Observable<T>),
  deps?: any[],
): [T | undefined, boolean, Error];
export function useObservable<T>(
  observable: Observable<T> | (() => Observable<T>),
  deps: any[],
  defaultValue: T,
): [T, boolean, Error];
export function useObservable<T>(
  observable: Observable<T> | (() => Observable<T>),
  deps?: any[],
  defaultValue?: T,
): [T | undefined, boolean, Error | undefined] {
  const [{ data, error, loading }, setParams] = useState<{
    data: T | undefined;
    error: Error | undefined;
    loading: boolean;
  }>({
    data: defaultValue,
    error: undefined,
    loading: !defaultValue,
  });

  useEffect(() => {
    setParams((params) => ({ ...params, loading: true }));

    const subscription = (
      observable instanceof Function ? observable() : observable
    ).subscribe({
      next: (value: T) => {
        setParams((params) => ({ ...params, data: value, loading: false }));
      },
      error: (error: Error) => {
        setParams((params) => ({ ...params, error, loading: false }));
      },
    });

    return () => subscription.unsubscribe();
  }, deps || []);

  return [data, loading, error];
}

export function useSubject<F extends (...args: any[]) => Observable<any>>(
  observableAction: F,
  deps?: any[],
): [
  Unpacked<ReturnType<F>> | undefined,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
];
export function useSubject<F extends (...args: any[]) => Observable<any>>(
  observableAction: F,
  deps: any[],
  defaultValue: Unpacked<ReturnType<F>>,
): [
  Unpacked<ReturnType<F>>,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
];
export function useSubject<F extends (...args: any[]) => Observable<any>>(
  observableAction: F,
  deps?: any[],
  defaultValue?: Unpacked<ReturnType<F>>,
): [
  Unpacked<ReturnType<F>> | undefined,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
] {
  const [{ data, error, loading }, setParams] = useState<{
    data: any | undefined;
    error: Error | undefined;
    loading: boolean;
  }>({
    data: defaultValue,
    error: undefined,
    loading: false,
  });
  const [nextData] = useState<{
    subject: Subject<Parameters<F>>;
    next: (...args: Parameters<F>) => void;
    //@ts-ignore
  }>(() => {
    const subject = new Subject();

    return {
      subject,
      next: (...args: Parameters<F>) => subject.next(args),
    };
  });

  useEffect(() => {
    setParams((params) => ({ ...params, loading: false }));
    const subscription = nextData.subject
      .pipe(
        tap(() =>
          setParams((params) => ({
            ...params,
            loading: true,
            error: undefined,
          })),
        ),
        switchMap((args) =>
          observableAction(...args).pipe(
            catchError((error: Error) => of(error)),
          ),
        ),
      )
      .subscribe({
        next: (value: Unpacked<ReturnType<F>> | Error) => {
          if (value instanceof Error) {
            setParams((params) => ({
              ...params,
              loading: false,
              error: value,
              value: undefined,
            }));
          } else {
            setParams((params) => ({
              ...params,
              loading: false,
              data: value,
              error: undefined,
            }));
          }
        },
      });

    return () => subscription.unsubscribe();
  }, deps || []);

  return [data, nextData.next, loading, error];
}

export function useSubscription<T>(
  observable: Observable<T>,
  callback: (value: T) => void,
  deps?: any[],
): void;
export function useSubscription<T extends (...args: any[]) => Observable<any>>(
  mapper: T,
  callback: (value: Unpacked<ReturnType<T>>) => void,
  deps?: any[],
): [(...args: Parameters<T>) => void];
export function useSubscription(
  item: any,
  callback: any,
  deps?: any[],
): void | [any] {
  const [nextData] = useState<{
    subject: Subject<any>;
    next: (...args: any[]) => void;
    //@ts-ignore
  }>(() => {
    const subject = new Subject();

    return {
      subject,
      next: (...args: any[]) => subject.next(args),
    };
  });
  useEffect(() => {
    let subscription = Subscription.EMPTY;

    if (item instanceof Function) {
      subscription = nextData.subject
        .pipe(switchMap((args) => item(...args)))
        .subscribe(callback);
    } else {
      subscription = item.subscribe(callback);
    }

    return () => subscription.unsubscribe();
  }, deps || []);

  return [nextData.next];
}
