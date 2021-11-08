import memoizee from 'memoizee';
import { useEffect, useState } from 'react';
import { Observable, of, Subject, Subscription, switchMap } from 'rxjs';

import { Unpacked } from '../utils/unpacked';

export function useObservable<T>(
  observable: Observable<T>,
): [T | undefined, boolean, Error];
export function useObservable<T>(
  observable: Observable<T>,
  defaultValue: T,
): [T, boolean, Error];
export function useObservable<T>(
  observable: Observable<T>,
  defaultValue?: T,
): [T | undefined, boolean, Error | undefined] {
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const subscription = observable.subscribe({
      next: (value: T) => {
        setData(() => value);
        setLoading(false);
      },
      error: (error: Error) => {
        setError(error);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [observable, setError, setLoading, setData]);

  return [data, loading, error];
}

export function useObservableAction<
  F extends (...args: any[]) => Observable<any>,
>(
  observableAction: F,
): [
  Unpacked<ReturnType<F>> | undefined,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
];
export function useObservableAction<
  F extends (...args: any[]) => Observable<any>,
>(
  observableAction: F,
  defaultValue: Unpacked<ReturnType<F>>,
): [
  Unpacked<ReturnType<F>>,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
];
export function useObservableAction<
  F extends (...args: any[]) => Observable<any>,
>(
  observableAction: F,
  defaultValue?: Unpacked<ReturnType<F>>,
): [
  Unpacked<ReturnType<F>> | undefined,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
] {
  const [data, setData] = useState<Unpacked<ReturnType<F>> | undefined>(
    defaultValue,
  );
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [nextData, setNextData] = useState<{
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
    const memoizedAction = memoizee(observableAction);

    setLoading(true);
    const subscription = nextData.subject
      .pipe(switchMap((args) => memoizedAction(...args)))
      .subscribe({
        next: (value: Unpacked<ReturnType<F>>) => {
          setData(() => value);
          setLoading(false);
        },
        error: (error: Error) => {
          setError(error);
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [observableAction, setError, setLoading, setData, nextData]);

  return [data, nextData.next, loading, error];
}
