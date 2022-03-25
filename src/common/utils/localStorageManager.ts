import { BehaviorSubject, Observable } from 'rxjs';

const mapKeyToBehaviorSubject = new Map<string, BehaviorSubject<any>>();

window.addEventListener('storage', ({ key, newValue }) => {
  if (!key) {
    return;
  }

  const subject = mapKeyToBehaviorSubject.get(key);

  if (!subject) {
    return;
  }

  if (newValue === undefined || newValue === null) {
    return subject.next(newValue);
  }

  return subject.next(JSON.parse(newValue) as any);
});

const set = <T>(key: string, value: T | undefined): void => {
  if (value === undefined || value === null) {
    localStorage.removeItem(key);
  }
  const newValue = JSON.stringify(value);
  localStorage.setItem(key, newValue);

  if (!mapKeyToBehaviorSubject.has(key)) {
    mapKeyToBehaviorSubject.set(key, new BehaviorSubject(get(key)));
  }
  mapKeyToBehaviorSubject.get(key)!.next(value);
};

const get = <T>(key: string): T | undefined | null => {
  const rawValue = localStorage.getItem(key);

  if (rawValue === undefined || rawValue === null) {
    return rawValue;
  }

  return JSON.parse(rawValue) as any;
};

const getStrict = <T>(key: string): T | undefined | null => {
  const rawValue = localStorage.getItem(key);

  try {
    return JSON.parse(rawValue as any) as any;
  } finally {
  }
};

const getStream = <T>(key: string): Observable<T | undefined | null> => {
  if (!mapKeyToBehaviorSubject.has(key)) {
    mapKeyToBehaviorSubject.set(key, new BehaviorSubject(get(key)));
  }

  return mapKeyToBehaviorSubject.get(key)!;
};

const remove = (key: string): void => localStorage.removeItem(key);

const clear = (): void => localStorage.clear();

export const localStorageManager = {
  set,
  get,
  getStrict,
  getStream,
  remove,
  clear,
};
