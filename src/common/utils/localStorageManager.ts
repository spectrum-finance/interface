import { BehaviorSubject, Observable } from 'rxjs';

const stringifyBigIntReviewer = (key: string, value: any) =>
  typeof value === 'bigint'
    ? { value: value.toString(), _bigint: true }
    : value;

const stringifyBigIntReplacer = (key: string, value: any) =>
  !!value?._bigint ? BigInt(value.value) : value;

const mapKeyToBehaviorSubject = new Map<
  string,
  { stream: BehaviorSubject<any>; disableSelf: boolean }
>();

window.addEventListener('storage', ({ key, newValue }) => {
  if (!key) {
    return;
  }

  const subject = mapKeyToBehaviorSubject.get(key);

  if (!subject) {
    return;
  }

  if (newValue === undefined || newValue === null) {
    return subject.stream.next(newValue);
  }

  return subject.stream.next(
    JSON.parse(newValue, stringifyBigIntReplacer) as any,
  );
});

const set = <T>(key: string, value: T | undefined): void => {
  if (value === undefined || value === null) {
    localStorage.removeItem(key);
  }
  const newValue = JSON.stringify(value, stringifyBigIntReviewer);
  localStorage.setItem(key, newValue);

  if (!mapKeyToBehaviorSubject.has(key)) {
    return;
  }
  if (!mapKeyToBehaviorSubject.get(key)!.disableSelf) {
    mapKeyToBehaviorSubject.get(key)!.stream.next(value);
  }
};

const get = <T>(key: string): T | undefined | null => {
  const rawValue = localStorage.getItem(key);

  if (rawValue === undefined || rawValue === null) {
    return rawValue;
  }

  return JSON.parse(rawValue, stringifyBigIntReplacer) as any;
};

const getStrict = <T>(key: string): T | undefined | null => {
  const rawValue = localStorage.getItem(key);

  try {
    return JSON.parse(rawValue as any, stringifyBigIntReplacer) as any;
  } finally {
  }
};

const getStream = <T>(
  key: string,
  disableSelf = false,
): Observable<T | undefined | null> => {
  if (!mapKeyToBehaviorSubject.has(key)) {
    mapKeyToBehaviorSubject.set(key, {
      stream: new BehaviorSubject(get(key)),
      disableSelf,
    });
  }

  return mapKeyToBehaviorSubject.get(key)!.stream;
};

const remove = (key: string): void => {
  localStorage.removeItem(key);

  if (!mapKeyToBehaviorSubject.has(key)) {
    return;
  }
  if (!mapKeyToBehaviorSubject.get(key)!.disableSelf) {
    mapKeyToBehaviorSubject.get(key)!.stream.next(undefined);
  }
};

const clear = (): void => localStorage.clear();

export const localStorageManager = {
  set,
  get,
  getStrict,
  getStream,
  remove,
  clear,
};
