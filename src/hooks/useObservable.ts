import memoizee from 'memoizee';
import { useEffect, useState } from 'react';
import { Observable, Observer, Subject, switchMap } from 'rxjs';
import { observe } from 'web-vitals/dist/modules/lib/observe';

import { Unpacked } from '../utils/unpacked';

export function useSubscription<T>(
  observable: Observable<T>,
  observer: Partial<Observer<T>>,
): [T | undefined, boolean, Error];
export function useSubscription<T>(
  observable: Observable<T>,
  observer: Partial<Observer<T>>,
  defaultValue: T,
): [T, boolean, Error];
export function useSubscription<T>(
  observable: Observable<T>,
  observer: Partial<Observer<T>>,
  defaultValue?: T,
): [T | undefined, boolean, Error | undefined] {
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const subscription = observable.subscribe({
      next: (value: T) => {
        observer instanceof Function
          ? observer(value)
          : observer?.next
          ? observer.next(value)
          : undefined;
        setLoading(false);
      },
      error: (error: Error) => {
        observer instanceof Function
          ? observer(error)
          : observer?.error
          ? observer.error(error)
          : undefined;
        setError(error);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [observable, setError, setLoading, observer]);

  return [data, loading, error];
}

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

export function useSubject<F extends (...args: any[]) => Observable<any>>(
  observableAction: F,
): [
  Unpacked<ReturnType<F>> | undefined,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
];
export function useSubject<F extends (...args: any[]) => Observable<any>>(
  observableAction: F,
  defaultValue: Unpacked<ReturnType<F>>,
): [
  Unpacked<ReturnType<F>>,
  (...args: Parameters<F>) => void,
  boolean,
  Error | undefined,
];
export function useSubject<F extends (...args: any[]) => Observable<any>>(
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
